<template>
  <main>
    <ProfileComponent :key="$route.params.id" />
  </main>
</template>
  
  <script>
  import ProfileComponent from './ProfileComponent.vue';
  
  export default {
    name: 'ProfilePage',
    components: {ProfileComponent},
  }
  </script>
