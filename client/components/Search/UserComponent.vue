<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="notification container"
  >
    <router-link
      :to="userPath"
      style="text-decoration: none; color: inherit;"
    >
      <section class="icon">
        <ProfilePicture
          :key="user._id"
          :user="user"
        />
      </section>
    </router-link>
    <section class="content">
      <header class="bio">
        <h3 class="author">
          {{ user.displayName }}
        </h3>
        <h3 class="username">
          @{{ user.username }}
        </h3>
      </header>
    </section>
    <section class="content">
      <img 
        v-if="user.isPrivate === 'true'"
        src="../../public/padlock.png"
      >
    </section>
    <section class="content">
      <section v-if="($store.state.userId !== user._id)">
        <FollowButton
          :key="user._id"
          :user="user"
        />
      </section>
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
  </article>
</template>
    
<script>
    import ProfilePicture from '../Profile/ProfilePicture.vue'
    import FollowButton from './FollowButton.vue';
    export default {
      name: 'UserComponent',
      components: {ProfilePicture, FollowButton},
      props: {
        user: {
          type: Object,
          required: true
        },
        inProfile: {
          type: Boolean,
          required: true
        }
      },
      data() {
        return {
          alerts: {} ,
          userPath: `profile/${this.user._id}`
        };
      },
      mounted(){
        this.fetchFollowing()
      }
    }
    </script>
    
    <style scoped>
  .icon {
      flex: 1;
      justify-content: center;
      align-items: center;
      display: flex;
  }
  
  .content {
      display: flex;
  }

  .content img {
    height: 20px;
  }
  .container {
      display: flex;
      align-items: center;
      box-shadow: 0px 2px 5px rgb(141, 156, 160);
      padding: 15px;
      position: relative;
      margin-bottom: 20px;
      border-radius: 5px;
      background-color: #fff;
  }
  
  img {
      height: 50px;
      margin: 30px;
  }

.author {
  color: #24b2e1;
  font-family: Arial, Helvetica, sans-serif;
  margin-bottom: 0;
}
.username {
  font-family: Arial, Helvetica, sans-serif;
  color: rgb(190, 186, 186);
  padding-left: 5px;
  font-size: 15px;
  margin-top: 10px;
}
  
    </style>
    