<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <nav>
    <div class="left">
      <img src="../../public/logo2.png">
      <h1 class="title">
        fritter 
      </h1>
    </div>
    <div class="right">
      <router-link to="/">
        <span :class="{selected: $route.name === 'Home'}">Home </span>
      </router-link>
      <router-link
        v-if="$store.state.username"
        to="/account"
      >
        <span :class="{selected: $route.name === 'Account'}">Account </span>
      </router-link>
      <router-link
        v-else
        to="/login"
      >
        <span :class="{selected: $route.name === 'Login'}">Login </span>
      </router-link>
      <router-link
        v-if="$store.state.username"
        to="/notifications"
      >
        <span :class="{selected: $route.name === 'Notifications'}">Notifications </span>
      </router-link>
      <router-link
      v-if="$store.state.username"
        to="/search"
      >
        <span :class="{selected: $route.name === 'Search'}">Search </span>
      </router-link>
      <router-link
      v-if="$store.state.username"
        :to="`/profile/${$store.state.userId}`"
      >
        <span :class="{selected: $route.name === 'Profile' && $route.params.id === $store.state.userId}">Profile </span>
      </router-link>
    </div>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in $store.state.alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </nav>
</template>

<style scoped>
nav {
    padding: 1vw 2vw;
    background-color: #24b2e1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    box-shadow: 0px 2px 5px rgb(141, 156, 160);
}

.title {
    font-size: 32px;
    margin: 0 5px;
    font-family: Arial, Helvetica, sans-serif;
    color: #fff
}

img {
    height: 32px;
}

.left {
	display: flex;
	align-items: center;
}

.right {
    font-size: 20px;
    display: grid;
    gap: 16px;
    grid-auto-flow: column;
    align-items: center;
}

.right a {
    margin-left: 10px;
    color: #fff;
    font-family: Arial, Helvetica, sans-serif;
    text-decoration: none;
}

.alerts {
    width: 25%;
}
.selected {
  font-weight: bold;
  text-shadow: 0px 1px 2px rgb(141, 156, 160);

}
</style>
