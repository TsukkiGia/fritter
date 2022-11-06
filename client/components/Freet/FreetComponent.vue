<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="freet"
  >
    <header>
      <div class="container">
        <router-link
          :to="userPath"
          style="text-decoration: none; color: inherit;"
        >
          <div>
            <img 
              v-if="freet.profilePictureColor === 'red'"
              src="../../public/1.png"
            >
            <img 
              v-if="freet.profilePictureColor === 'orange'"
              src="../../public/2.png"
            >
            <img 
              v-if="freet.profilePictureColor === 'yellow'"
              src="../../public/3.png"
            >
            <img 
              v-if="freet.profilePictureColor === 'green'"
              src="../../public/5.png"
            >
            <img 
              v-if="freet.profilePictureColor === 'blue'"
              src="../../public/5.png"
            >
            <img 
              v-if="freet.profilePictureColor === 'purple'"
              src="../../public/6.png"
            >
            <img 
              v-if="freet.profilePictureColor === 'pink'"
              src="../../public/7.png"
            >
          </div>
        </router-link>
        <div class="user-bio">
          <h3 class="author">
            {{ freet.displayName }} <span class="username">@{{ freet.author }}</span>
          </h3>
        </div>
        <div class="date">
          {{ ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][date.getMonth()] }} {{ date.getDate() }}, {{ date.getFullYear() }}
        </div>
      </div>
    </header>
    <textarea
      v-if="editing"
      class="content"
      :value="draft"
      @input="draft = $event.target.value"
    />
    <p
      v-else
      class="content"
    >
      <router-link
        :to="path"
        style="text-decoration: none; color: inherit;"
      >
        {{ freet.content }}
      </router-link>
    </p>
    <p class="info">
      <i v-if="freet.edited">(edited)</i>
    </p>
    <div
     
      class="actions"
    >
      <span
        v-if="$store.state.username === freet.author"
      >
        <button
          v-if="editing"
          @click="submitEdit"
        >
          ✅ Save changes
        </button>
        <button
          v-if="editing"
          @click="stopEditing"
        >
          🚫 Discard changes
        </button>
        <button
          v-if="!editing"
          @click="startEditing"
        >
          ✏️ Edit
        </button>
        <button 
          v-if="!freet.timeOfDeletion"
          @click="deleteFreet"
        >
          🗑️ Delete
        </button>
        <button 
          v-if="freet.timeOfDeletion"
          @click="restoreFreet"
        >
          🗑️ Restore
        </button>
      </span>
      <span
        v-if="$store.state.userId !== null"
      >
        <button
          v-if="!liked"
          @click="likeRequest"
        > 
          👍 Like
        </button>

        <button
          v-if="liked"
          @click="likeRequest"
        > 
          👍 Remove like
        </button>
        <button
          v-if="!refreeted"
          @click="refreetRequest"
        > 
          🔄 Refreet
        </button>

        <button
          v-if="refreeted"
          @click="refreetRequest"
        > 
          🔄 Remove refreet
        </button>

        <button
          v-if="!downvoted"
          @click="downvoteRequest"
        > 
          ⬇️ Downvote
        </button>

        <button
          v-if="downvoted"
          @click="downvoteRequest"
        > 
          ⬇️ Remove downvote
        </button>
      </span>
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
  </article>
</template>

<script>
import moment from 'moment';
export default {
  name: 'FreetComponent',
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    },
    inProfile: {
      type: Boolean
    }
  },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      draft: this.freet.content, // Potentially-new content for this freet
      alerts: {}, // Displays success/error messages encountered during freet modification
      date: moment(this.freet.dateModified, 'MMMM Do YYYY, h:mm:ss a').toDate(),
      path: `freet/${this.freet._id}`,
      userPath: this.inProfile ? `${this.freet.authorId}` : `profile/${this.freet.authorId}`
    };
  },
  computed: {
    liked() {
      return this.freet.likers.includes(this.$store.state.userId);
    },
    refreeted() {
      return this.freet.refreeters.includes(this.$store.state.userId);
    },
    downvoted() {
      return this.freet.downvoters.includes(this.$store.state.userId);
    }
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.freet.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      this.draft = this.freet.content;
    },
    async addNotification(notificationType){
      const notificationReceiver = this.freet.authorId;
      const notificationFreet = this.freet._id;
      const fields = {notificationReceiver, notificationFreet, notificationType};
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
    async deleteNotification(notificationType){
      const notificationReceiver = this.freet.authorId;
      const notificationFreet = this.freet._id;
      const fields = {notificationReceiver, notificationFreet, notificationType};
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
    async deleteFreet() {
      /**
       * Delete this freet.
       */
       try {
        const fields = {toDelete: 'true'};
        const r = await  fetch(`/api/freets/${this.freet._id}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}});
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
    async restoreFreet() {
      /**
       * Restores this freet.
       */
       try {
        const fields = {toDelete: 'false'};
        const r = await  fetch(`/api/freets/${this.freet._id}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}});
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        if (!this.$store.currentFreetId){
          this.$store.commit('refreshComments');
        }
        this.$store.commit('refreshFreets');
        this.$store.commit('refreshDeletedFreets');

      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async submitEdit() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (this.freet.content === this.draft) {
        const error = 'Error: Edited freet content should be different than current freet content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }
      try {
        const fields = {content: this.draft};
        const r = await  fetch(`/api/freets/${this.freet._id}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}});
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        if (!this.$store.currentFreetId){
          this.$store.commit('refreshComments');
        }
        this.editing = false;
        this.$store.commit('refreshFreets');
        

      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
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
    async likeRequest() {
      if (!this.liked){
        try {
          const fields = {freetId: this.freet._id};
          const r = await  fetch('/api/likes', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}});
          if (!r.ok) {
            const res = await r.json();
            throw new Error(res.error);
          }
          if (!this.$store.currentFreetId){
            this.$store.commit('refreshComments');
          }
          this.$store.commit('refreshFreets');
          this.addNotification("like");
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
      } else {
        try {
          const r = await fetch(`/api/likes?freetId=${ this.freet._id}`, {method: 'DELETE'})
          if (!r.ok) {
            const res = await r.json();
            throw new Error(res.error);
          }
          if (!this.$store.currentFreetId){
            this.$store.commit('refreshComments');
          }
          this.$store.commit('refreshFreets');
          this.deleteNotification("like");
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
      }
    },
    async refreetRequest() {
      if (!this.refreeted){
        try {
        const fields = {freetId: this.freet._id};
        const r = await  fetch('/api/refreets', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}});
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        if (!this.$store.currentFreetId){
          this.$store.commit('refreshComments');
        }
        this.$store.commit('refreshFreets');
        this.addNotification("refreet");
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
      } else {
        try {
        const r = await fetch(`/api/refreets?freetId=${this.freet._id}`, {method: 'DELETE'})
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        if (!this.$store.currentFreetId){
          this.$store.commit('refreshComments');
        }
        this.$store.commit('refreshFreets');
        this.deleteNotification("refreet");
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
      }
    },
    async downvoteRequest() {
      if (!this.downvoted){
        try {
        const fields = {freetId: this.freet._id};
        const r = await  fetch('/api/downvotes', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}});
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
      } else {
        try {
        const r = await    fetch(`/api/downvotes?freetId=${ this.freet._id}`, {method: 'DELETE'})
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
      }
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 0px;
}
.freet {
    box-shadow: 0px 2px 5px rgb(141, 156, 160);
    padding: 15px;
    position: relative;
    margin-bottom: 20px;
    border-radius: 5px;
    background-color: #fff;
}
.actions button {
  margin-top: 10px;
  margin-right: 15px;
}
.author {
  color: #24b2e1;
  font-family: Arial, Helvetica, sans-serif;
}
.content {
  color: #898b8c;
  font-family: Arial, Helvetica, sans-serif;
}
.username {
  font-size: 15px;
  color: rgb(190, 186, 186);
  padding-left: 5px;
}
.user-bio {
  margin-bottom: 8px;
}
img {
  height: 50px;
  margin-right: 20px;
}
.date {
  font-size: 15px;
  color: rgb(190, 186, 186);
  font-family: Arial, Helvetica, sans-serif;
  margin-left: 20px;
}

button {
  background-color: #24b2e1;
  color: white;
  border: 2px solid #24b2e1; 
  border-radius: 5px;
  padding-left:5px;
  padding-right:5px;
  box-shadow: 0px 1px 2px rgb(141, 156, 160);
  font-size: 15px;

}
</style>
