<!-- Default page that also displays freets -->

<template>
  <main>
    <section>
      <header>
        <div>
          <h2>
            Viewing search results
          </h2>
        </div>
        <div>
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
            <section class="alerts">
              <article
                v-for="(status, alert, index) in alerts"
                :key="index"
                :class="status"
              >
                <p>{{ alert }}</p>
              </article>
            </section>
          </form>
        </div>
      </header>
    </section>
    <section
      v-if="hasSearched"
    >
      <button
        @click="freetResult"
      >
        Freets
      </button>
      <button
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
    </section>
    <section
      v-if="hasSearched && !isFreetResult"
    >
      <UserComponent
        v-for="user in $store.state.searchResults"
        :key="user.id"
        :user="user"
      />
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
  section {
    display: flex;
    flex-direction: column;
  }
  
  header, header > * {
      display: flex;
      justify-content: space-between;
      align-items: center;
  }
  
  button {
      margin-right: 10px;
  }
  
  section .scrollbox {
    flex: 1 0 50vh;
    padding: 3%;
    overflow-y: scroll;
  }
  </style>