<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2>@{{ $store.state.username }}'s New Beginning </h2>
      </header>
    </section>
    <section v-else>
      <header>
        <h2>Welcome to Fritter!</h2>
      </header>
      <article>
        <h3>
          <router-link to="/login">
            Sign in
          </router-link>
          to view a new beginning.
        </h3>
      </article>
    </section>
    <section>
      <h2>Delete all freets before this date</h2>
      <form @submit.prevent="submit">
        <input
          v-model="deadlineDate"
          type="date"
        >
        <input type="submit">
      </form>
    </section>
  </main>
</template>
    
    <script>
    
    export default {
      name: 'ANewBeginningPage',
      data() {
        return {
            deadlineDate: ""
        }
      },
      methods: {
        async submit() {
            if (this.deadlineDate !== ""){
                let [y, m, d] = this.deadlineDate.split('-');
                console.log(this.deadlineDate);
                const fields = {deadlineYear: y, deadlineMonth: m, deadlineDay: d};
                const options = {method: "PUT", headers: {'Content-Type': 'application/json'}, body: JSON.stringify(fields)};
                const url = `/api/freets`;
                try {
                    const r = await fetch(url, options);
                    const res = await r.json();
                    if (!r.ok) {
                        throw new Error(res.error);
                    }
            
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