<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="notification"
  >
    <div class="container">
      <div class="icon">
        <img 
          v-if="notification.notificationType == 'like'"
          src="../../public/heart.png"
        >
        <img 
          v-if="notification.notificationType == 'refreet'"
          src="../../public/refreet.png"
        >
        <img 
          v-if="notification.notificationType == 'comment'"
          src="../../public/comment.png"
        >
        <img 
          v-if="notification.notificationType == 'follow' || notification.notificationType == 'followrequest'"
          src="../../public/follow.png"
        >
      </div>
      
      <div class="content">
        <router-link
          :to="path"
          style="text-decoration: none; color: inherit;"
        >
          <header>
            <h3 class="author">
              @{{ notification.notificationSender.username }} {{
                (notification.notificationType == "like") ? "liked your Freet" : 
                ((notification.notificationType == "refreet") ? "refreeted your Freet" :
                  ((notification.notificationType == "comment") ? "commented on your Freet" :
                    ((notification.notificationType == "follow") ? "followed you" : "requested to follow you"))   
                )
              }}
            </h3> 
          </header>
          <p class="info">
            Notification received at {{ notification.notificationTime }}
          </p>
        </router-link>
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
      
      <div 
        v-if="notification.hasAcceptedFollowRequest == 'received'"
        class="follow-request"
      >
        <img 
          src="../../public/check.png"
          @click="acceptFollowRequest"
        >
        <img 
          src="../../public/cross.png"
          @click="rejectFollowRequest"
        >
      </div>
      <div 
        v-if="notification.hasAcceptedFollowRequest == 'true'"
        class="follow-request"
      >
        <h2>You accepted the follow request!</h2>
      </div>
      <div 
        v-if="notification.hasAcceptedFollowRequest == 'false'"
        class="follow-request"
      >
        <h2>You rejected the follow request!</h2>
      </div>
    </div>
  </article>
</template>
  
  <script>
  export default {
    name: 'NotificationComponent',
    props: {
      // Data from the stored freet
      notification: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        alerts: {} 
      };
    },
    computed: {
      path(){
        if (this.notification.notificationType === 'follow' || this.notification.notificationType ==='followrequest') return "/profile/"+this.notification.notificationSender._id;
        return "/freet/"+this.notification.notificationFreet;
      }
    },
    methods: {
      async request(params) {
        /**
         * Submits a request to the freet's endpoint
         * @param params - Options for the request
         * @param params.body - Body for the request, if it exists
         * @param params.callback - Function to run if the the request succeeds
         */
        const options = {
          method: params.method, headers: {'Content-Type': 'application/json'}
        };
        if (params.body) {
          options.body = params.body;
        }
  
        try {
          const r = await fetch(`/api/freets/${this.freet._id}`, options);
          if (!r.ok) {
            const res = await r.json();
            throw new Error(res.error);
          }
  
          this.editing = false;
          this.$store.commit('refreshFreets');
  
          params.callback();
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
      },
      async acceptFollowRequest() {
        const options = {
          method: "PUT", headers: {'Content-Type': 'application/json'},  body : JSON.stringify({ hasAcceptedFollowRequest:'true'})
        };
        try {
          const r = await fetch(`/api/notifications/${this.notification._id}`, options);
          if (!r.ok) {
            const res = await r.json();
            throw new Error(res.error);
          }
          this.$store.commit('refreshNotifications');
  
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
      },
      async rejectFollowRequest() {
        const options = {
          method: "PUT", headers: {'Content-Type': 'application/json'}, body : JSON.stringify({hasAcceptedFollowRequest:'false'})
        };
        try {
          const r = await fetch(`/api/notifications/${this.notification._id}`, options);
          if (!r.ok) {
            const res = await r.json();
            throw new Error(res.error);
          }
          this.$store.commit('refreshNotifications');
  
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
      } 
    }
  };
  </script>
  
  <style scoped>
  .notification {
    box-shadow: 0px 2px 5px rgb(141, 156, 160);
    padding: 15px;
    position: relative;
    margin-bottom: 20px;
    border-radius: 5px;
    background-color: #fff;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 13pt;
  }
.icon {
	flex: 1;
    justify-content: center;
  align-items: center;
  display: flex;
}

.content {
    flex: 8;
}
.follow-request {
    flex: 3;
    justify-content: right;
  align-items: center;
  display: flex;
 
}
.container {
    display: flex;
}

img {
    height: 20px;
    margin: 30px;
}

  </style>
  