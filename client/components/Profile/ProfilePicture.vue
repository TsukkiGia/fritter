<template>
  <section>
    <img 
      v-if="user.profilePictureColor === 'red'"
      src="../../public/1.png"
    >
    <img 
      v-if="user.profilePictureColor === 'orange'"
      src="../../public/2.png"
    >
    <img 
      v-if="user.profilePictureColor === 'yellow'"
      src="../../public/3.png"
    >
    <img 
      v-if="user.profilePictureColor === 'green'"
      src="../../public/4.png"
    >
    <img 
      v-if="user.profilePictureColor === 'blue'"
      src="../../public/5.png"
    >
    <img 
      v-if="user.profilePictureColor === 'purple'"
      src="../../public/6.png"
    >
    <img 
      v-if="user.profilePictureColor === 'pink'"
      src="../../public/7.png"
    >
  </section>
</template>
    
<script>
  export default {
    name: 'ProfilePicture',
    props: {
      user: {
        type: Object,
        required: true
      }
    },
}
</script>
<style scoped>
img {
  height: 50px;
  margin-right: 20px;
}
</style>