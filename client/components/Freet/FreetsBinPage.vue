<template>
  <article>
    <section v-if="$store.state.username">
      <header>
        <h2>@{{ $store.state.username }}'s Freet Bin </h2>
      </header>
      <section
        v-if="$store.state.deletedFreets.length"
      >
        <FreetComponent
          v-for="freet in $store.state.deletedFreets"
          :key="freet.id"
          :freet="freet"
          @refresh="fetchDeletedFreets"
        />
      </section>
      <article
        v-else
      >
        <h3>No deleted found.</h3>
      </article>
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
          to view freet bin.
        </h3>
      </article>
    </section>
  </article>
</template>
  
  <script>
  import FreetComponent from '@/components/Freet/FreetComponent.vue';
  
  export default {
    name: 'FreetBinPage',
    components: {FreetComponent},
    mounted() {
          this.fetchDeletedFreets();
    },
    methods: {
      async fetchDeletedFreets() {
        const url = '/api/freets/freetBin';
        try {
          const r = await fetch(url);
          const res = await r.json();
          if (!r.ok) {
            throw new Error(res.error);
          }
  
          this.$store.commit('updateDeletedFreets', res);
        } catch (e) {
          
  
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 20px;
  }
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