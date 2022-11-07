<!-- Default page that also displays freets -->

<template>
  <main>
    <section>
      <header>
        <h2>
          Search
        </h2>
      </header>
      <form @submit.prevent="submit">
        <input
          v-model="value"
          type="text"
          placeholder="Search Query"
        >
        <button 
          type="submit"
        >
          Search
        </button>
      </form>
    </section>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
    <section
      v-if="hasSearched"
      class="results"
    >
      <button
        :class="{notSelected: !isFreetResult}"
        @click="freetResult"
      >
        Freets
      </button>
      <button
        :class="{notSelected: isFreetResult}"
        @click="userResult"
      >
        Users
      </button>
    </section>
    <section
      v-if="hasSearched && isFreetResult"
    >
      <FreetComponent
        v-for="freet in $store.state.searchResults"
        :key="freet.id"
        :freet="freet"
      />
      <h2 v-if="$store.state.searchResults.length === 0">
        No Freets Found!
      </h2>
    </section>
    <section
      v-if="hasSearched && !isFreetResult"
    >
      <UserComponent
        v-for="user in $store.state.searchResults"
        :key="user.id"
        :user="user"
      />
      <h2 v-if="$store.state.searchResults.length === 0">
        No Users Found!
      </h2>
    </section>
  </main>
</template>
  
  <script>
  import FreetComponent from '@/components/Freet/FreetComponent.vue';
  import UserComponent from '@/components/Search/UserComponent.vue';
  
  export default {
    name: 'SearchPage',
    components: {FreetComponent, UserComponent},
    data() {
    return {value: '', alerts: {}, isFreetResult: true, hasSearched: false};
  },
  methods: {
    async freetResult(){
        this.isFreetResult = true;
        await this.submit();
    },
    async userResult(){
        this.isFreetResult = false;
        await this.submit();
    },
    async submit() {
        this.hasSearched = true;
        if (this.isFreetResult){
            const url = `/api/freets?freetContains=${this.value}`;
            try {
                const r = await fetch(url);
                const res = await r.json();
                if (!r.ok) {
                    throw new Error(res.error);
                }

                this.$store.commit('updateSearchResults', res);
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        } 
        
        else {
            const url = `/api/users?username=${this.value}`;
            try {
                const r = await fetch(url);
                const res = await r.json();
                if (!r.ok) {
                    throw new Error(res.error);
                }

                this.$store.commit('updateSearchResults', res);
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        }
    }
}
};
  </script>
  
  <style scoped>
  h2 {
  color: #24b2e1;
  font-family: Arial, Helvetica, sans-serif;
  margin-bottom: 0;
}  
  button {
      margin-right: 10px;
      width: 10%;
  }
input {
  padding: 6px;
  border: 1px solid #9a9e9f; 
  border-radius: 3px;
  margin-top: 20px;
  margin-right: 16px;
  font-size: 17px;
  width: 80%;
}
button {
  background-color: #24b2e1;
  color: white;
  border: 2px solid #24b2e1; 
  border-radius: 5px;
  padding-left:5px;
  padding-right:5px;
  box-shadow: 0px 1px 2px rgb(141, 156, 160);
  font-size: 17px;
  height: 30px;
}

.notSelected {
  color: #24b2e1;
  background-color: white;
}

.results {
  margin-top: 50px;
}
  </style>