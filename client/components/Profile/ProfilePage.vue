<template>
  <main>
    <div
      v-if="user !== {}"
      class="ha"
    >
      <div>
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
      <div>
        <header>
          <h3> {{ user.displayName }}</h3>
          <h3> @{{ user.username }}</h3>
        </header>
        <img 
          v-if="user.isPrivate === 'true'"
          src="../../public/padlock.png"
        >
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
    
      <section>
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
      <section 
        v-if="$route.params.id === $store.state.userId"
      >
        <router-link to="/account">
          <button>
            Edit Profile
          </button>
        </router-link>
      </section>
      <section>
        <FreetComponent
          v-for="freet in $store.state.profileFreets"
          :key="freet.id"
          :freet="freet"
          :inProfile="true"
        />
      </section>
    </div>
  </main>
</template>
  
  <script>
  import FreetComponent from '@/components/Freet/FreetComponent.vue';
  
  export default {
    name: 'ProfilePage',
    components: {FreetComponent},
    data() {
        return {
            user: {},
            followStatus: "yes",
            alerts: {}
        }
    },
    created() {
        this.fetchUser();
    },
    methods: {
      async fetchUsersFreets() {
        console.log(this.user);
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
            console.log("hare")
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
            if (userObj.followedUser === userId && userObj.hasAcceptedFollowRequest){
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
}
  </style>