<template>
  <article
    v-if="user !== {}"
    class="ha"
  >
    <header>
      <h2>Profile</h2>
    </header>
        
    <section class="top">
      <UserComponent
        :key="user.id"
        :user="user"
      />
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
      
    <section 
      v-if="$route.params.id === $store.state.userId"
    >
      <router-link to="/account">
        <button>
          Edit Profile
        </button>
      </router-link>
    </section>
    <h3>Freets</h3>
    <section v-if="($store.state.userId === $route.params.id) || (user.isPrivate === 'false') || (user.isPrivate === 'true' && $store.state.currentFollowStatus === 'yes')">
      <FreetComponent
        v-for="freet in $store.state.profileFreets"
        :key="freet.id"
        :freet="freet"
        @refresh="fetchUser"
      />
    </section>
  </article>
</template>
    
    <script>
    import FreetComponent from '@/components/Freet/FreetComponent.vue';
    import UserComponent from '@/components/Search/UserComponent.vue';
    
    export default {
      name: 'ProfileComponent',
      components: {FreetComponent, UserComponent},
      data() {
          return {
              user: {},
              followStatus: "yes",
              alerts: {}
          }
      },
      mounted() {
          this.fetchUser();
      },
      methods: {
        async fetchUsersFreets() {
            const url =`/api/freets?author=${this.user.username}`;
              try {
              const r = await fetch(url);
              const res = await r.json();
              if (!r.ok) {
                  throw new Error(res.error);
              }
      
              this.$store.commit('updateProfileFreets', res);
              } catch (e) {
              
      
              this.$set(this.alerts, e, 'error');
              setTimeout(() => this.$delete(this.alerts, e), 3000);
              }
        },
        
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
           
          } catch (e) {
            
    
            this.$set(this.alerts, e, 'error');
            setTimeout(() => this.$delete(this.alerts, e), 3000);
          }
        },
        async fetchUser() {
          
          const url =`/api/users/${this.$route.params.id}`;
          try {
            const r = await fetch(url);
            const res = await r.json();
            if (!r.ok) {
              throw new Error(res.error);
            }
    
            this.user = res.user;
            await this.fetchFollowing();
            await this.fetchUsersFreets();
          } catch (e) {
            
    
            this.$set(this.alerts, e, 'error');
            setTimeout(() => this.$delete(this.alerts, e), 3000);
          }
        }
      }
    };
    </script>
    
    <style scoped>
  
    img {
      height: 50px;
      margin-top:20px;
  }
  .ha {
    margin: auto;
    width: 50%;
    color: #24b2e1;
    font-family: Arial, Helvetica, sans-serif;
  }
  
  button {
      background-color: #24b2e1;
    color: white;
    border: 2px solid #24b2e1; 
    border-radius: 5px;
    padding-left:5px;
    padding-right:5px;
    box-shadow: 0px 1px 2px rgb(141, 156, 160);
    font-size: 18px;
    margin-bottom: 10px;
    }
    </style>