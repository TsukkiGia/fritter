<!-- Default page that also displays freets -->

<template>
  <main class="mainPage">
    <section
      v-if="$store.state.username"
      class="buffer"
    >
      <CreateFreetForm />
      <section>
        <header class="left">
          <h2>
            Your Feed
          </h2>
        </header>
        <section
          v-if="$store.state.freets.length"
        >
          <FreetComponent
            v-for="freet in $store.state.freets"
            :key="freet.id"
            :freet="freet"
          />
        </section>
        <article
          v-else
        >
          <h3>No freets found.</h3>
        </article>
      </section>
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
          to create, edit, and delete freets.
        </h3>
      </article>
    </section>
  </main>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import CreateFreetForm from '@/components/Freet/CreateFreetForm.vue';

export default {
  name: 'FreetPage',
  components: {FreetComponent, CreateFreetForm},
  mounted(){
    this.$store.commit('refreshFreets');
  }
};
</script>

<style scoped>
.mainPage {
  margin: auto;
  width: 50%;
}

.buffer {
  margin-top: 30px;
}

.left h2 {
  color: #24b2e1;
  font-family: Arial, Helvetica, sans-serif;
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

.welcome {
  color: #24b2e1;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 25pt;
}
</style>
