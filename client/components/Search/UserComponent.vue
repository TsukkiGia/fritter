<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="notification"
  >
    <div class="container">
      <router-link
        :to="userPath"
        style="text-decoration: none; color: inherit;"
      >
        <div class="icon">
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
        </div>
      </router-link>
      <div class="content">
        <header class="bio">
          <h3 class="author">
            {{ user.displayName }}
          </h3>
          <h3 class="username">
            @{{ user.username }}
          </h3>
        </header>
      </div>
      <div class="content">
        <img 
          v-if="user.isPrivate === 'true'"
          src="../../public/padlock.png"
        >
      </div>
      <div class="content">
        <section v-if="($store.state.userId !== user._id)">
          <button
            v-if="followStatus === 'yes'"
            @click="updateFollow"
          >
            Following
          </button>
          <button
            v-if="followStatus === 'no'"
            @click="updateFollow"
          >
            Follow
          </button>
          <button
            v-if="followStatus === 'requested'"
            @click="updateFollow"
          >
            Requested
          </button>
        </section>
      </div>
      <section class="alerts">
        <article
          v-for="(status, alert, index) in alerts"
          :key="index"
          :class="status"
        >
          <p>{{ alert }}</p>
        </article>
      </section>
    </div>
  </article>
</template>
    
    <script>
    export default {
      name: 'UserComponent',
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
          followStatus: "yes",
          userPath: `profile/${this.user._id}`
        };
      },
      mounted(){
        this.fetchFollowing()
      },
      methods: {
        async addFollowNotification(){
        const notificationReceiver = this.$route.params.id;
        const fields = {notificationReceiver, notificationType: this.user.isPrivate === 'true'? "followrequest" : "follow" };
        try {
            const r = await fetch('/api/notifications', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}});
            if (!r.ok) {
              const res = await r.json();
              throw new Error(res.error);
            }
            if (!this.$store.currentFreetId){
              this.$store.commit('refreshComments');
            }
            this.$store.commit('refreshFreets');

          } catch (e) {
            this.$set(this.alerts, e, 'error');
            setTimeout(() => this.$delete(this.alerts, e), 3000);
          }
    },
    async deleteFollowNotification(){
        const notificationReceiver = this.$route.params.id;
        const fields = {notificationReceiver, notificationType: "follow" };
        try {
            const r = await  fetch('/api/notifications', {method: 'DELETE', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}});
            if (!r.ok) {
              const res = await r.json();
              throw new Error(res.error);
            }
            if (!this.$store.currentFreetId){
              this.$store.commit('refreshComments');
            }
            this.$store.commit('refreshFreets');

          } catch (e) {
            this.$set(this.alerts, e, 'error');
            setTimeout(() => this.$delete(this.alerts, e), 3000);
          }
    },
      async updateFollow(){
        // unfollow
        if (this.followStatus === "yes" || this.followStatus === "requested"){
          const options = {method: "DELETE", headers: {'Content-Type': 'application/json'}};
          const url = `/api/follows?followedUser=${this.$route.params.id}`;
          try {
            const r = await fetch(url, options);
            const res = await r.json();
            if (!r.ok) {
                throw new Error(res.error);
            }
    
            await this.fetchFollowing();
            this.deleteFollowNotification();
            } catch (e) {
            
    
            this.$set(this.alerts, e, 'error');
            setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        } else {
          const fields = {followedUser: this.$route.params.id}
          const options = {method: "POST", headers: {'Content-Type': 'application/json'}, body: JSON.stringify(fields)};
          const url = `/api/follows`;
          try {
            const r = await fetch(url, options);
            const res = await r.json();
            if (!r.ok) {
                throw new Error(res.error);
            }
    
            await this.fetchFollowing();
            this.addFollowNotification();
            } catch (e) {
            
    
            this.$set(this.alerts, e, 'error');
            setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        }

      },
      getFollowStatus(followingList){
        const userId = this.$route.params.id;
        const ids = followingList.map(userObj => {
          return userObj.followedUser;
        });
        if (ids.includes(userId)){
          for (const userObj of followingList){
            if (userObj.followedUser === userId && !userObj.hasAcceptedFollowRequest){
              return "yes";
            }
            if (userObj.followedUser === userId && userObj.hasAcceptedFollowRequest === 'true'){
              return "yes";
            }
            if (userObj.followedUser === userId && userObj.hasAcceptedFollowRequest !== 'true'){
              return "requested";
            }
          }
        } else {
          return "no";
        }
      },
      async fetchFollowing(){
        const url =`/api/follows`;
        try {
          const r = await fetch(url);
          const res = await r.json();
          if (!r.ok) {
            throw new Error(res.error);
          }
          
          this.followStatus = this.getFollowStatus(res);
          if (this.inProfile){
            this.$store.commit("setCurrentFollowStatus", this.followStatus);
          }
          
         
        } catch (e) {
          
  
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
      },
      }
    };
    </script>
    
    <style scoped>
  .icon {
      flex: 1;
      justify-content: center;
      align-items: center;
      display: flex;
      height: 50px;
  }
  
  .content {
      display: flex;
  }

  .content button {
    background-color: #24b2e1;
    color: white;
    border: 2px solid #24b2e1; 
    border-radius: 5px;
    padding-left:5px;
    padding-right:5px;
    box-shadow: 0px 1px 2px rgb(141, 156, 160);
    font-size: 15px;
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
    