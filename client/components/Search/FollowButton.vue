<template>
  <section v-if="followStatus !== 'none'">
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
</template>

<script>
    export default {
      name: 'FollowButton',
      props: {
        user: {
          type: Object,
          required: true
        }
      },
      data() {
        return {
          alerts: {} ,
          followStatus: "none",
        };
      },
      mounted(){
        this.fetchFollowing()
      },
      methods: {
        async addFollowNotification(){
        const notificationReceiver =  this.user._id;
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
        const notificationReceiver =  this.user._id;
        const fields = {notificationReceiver, notificationType: "follow" };
        try {
            const r = await fetch('/api/notifications', {method: 'DELETE', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}});
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
          const url = `/api/follows?followedUser=${ this.user._id}`;
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
          const fields = {followedUser:  this.user._id}
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
        const userId = this.user._id;
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
          if (this.$route.name === "Profile"){
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
    button {
        background-color: #24b2e1;
        color: white;
        border: 2px solid #24b2e1; 
        border-radius: 5px;
        padding-left:5px;
        padding-right:5px;
        box-shadow: 0px 1px 2px rgb(141, 156, 160);
        font-size: 15px;
        margin-left: 15px;
    }
</style>