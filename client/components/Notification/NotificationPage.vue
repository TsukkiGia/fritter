<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2>@{{ $store.state.username }}'s Notifications </h2>
      </header>
      <section
        v-if="$store.state.freets.length"
      >
        <NotificationComponent
          v-for="freet in $store.state.notifications"
          :key="freet.id"
          :notification="freet"
        />
      </section>
      <article
        v-else
      >
        <h3>No notifications found.</h3>
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
          to view notifications.
        </h3>
      </article>
    </section>
  </main>
</template>

<script>
import NotificationComponent from '@/components/Notification/NotificationComponent.vue';

export default {
  name: 'NotificationPage',
  components: {NotificationComponent},
  mounted() {
        this.fetchNotifications();
  },
  methods: {
    async fetchNotifications() {
        const url = '/api/notifications';
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        this.$store.commit('updateNotifications', res);
      } catch (e) {
        

        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
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
h2{
  color: #24b2e1;
  font-family: Arial, Helvetica, sans-serif;
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
h3 {
  font-family: Arial, Helvetica, sans-serif;
}
</style>