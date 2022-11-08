<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="freet"
  >
    <section
      v-if="freet.isRefreet === 'true'"
      class="refreet"
    >
      @{{ freet.refreeter }} Refreeted
    </section>
    <section class="container">
      <router-link
        :to="userPath"
        style="text-decoration: none; color: inherit;"
      >
        <ProfilePicture
          :key="freet._id"
          :user="freet"
        />
      </router-link>
      <header class="user-bio">
        <h3 class="author">
          {{ freet.displayName }} <span class="username">@{{ freet.author }}</span>
        </h3>
      </header>
      <span class="date">
        {{ ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][date.getMonth()] }} {{ date.getDate() }}, {{ date.getFullYear() }}
      </span>
    </section>
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
    <p
      v-if="$route.name === 'Freet'"
      class="toxicity"
    >
      Toxicity percentage: {{ toxicityPercentage }}%
    </p>
    <p class="info">
      <i v-if="freet.edited">(edited)</i>
    </p>
    <section
      class="actions container"
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
        class="container"
      >
        <ActionButton 
          :positive-message="'👍 Like'"
          :negative-message="'👍 Remove like'"
          :positive-callback="likeRequest"
          :negative-callback="removeLikeRequest"
          :freet="freet"
          :field="'likers'"
        />

        <ActionButton 
          :positive-message="'🔄 Refreet'"
          :negative-message="'🔄 Remove refreet'"
          :positive-callback="refreetRequest"
          :negative-callback="removeRefreetRequest"
          :freet="freet"
          :field="'refreeters'"
        />
        
        <span v-if="$route.name === 'Freet'">
          <ActionButton 
            :positive-message="'⬇️ Downvote'"
            :negative-message="'⬇️ Remove downvote'"
            :positive-callback="downvoteRequest"
            :negative-callback="removeDownvoteRequest"
            :freet="freet"
            :field="'downvoters'"
          />
        </span>
        <span v-if="$route.name === 'Home'">
          <button
            @click="hideFreet"
          > 
            🙈 Hide
          </button>
        </span>
      </span>
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
import moment from 'moment';
import ProfilePicture from '../Profile/ProfilePicture.vue'
import ActionButton from './ActionButton.vue';
export default {
  name: 'FreetComponent',
  components: {ProfilePicture, ActionButton},
  props: {
    freet: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      alerts: {}, // Displays success/error messages encountered during freet modification
      draft: this.freet.content
    };
  },
  computed: {
    date(){
      return moment(this.freet.dateCreated, 'MMMM Do YYYY, h:mm:ss a').toDate();
    } ,
    path(){
      return `/freet/${this.freet._id}`;
    },
    userPath(){
      return `/profile/${this.freet.authorId}`
    },
    liked() {
      if (this.freet === undefined) return [];
      return this.freet.likers.includes(this.$store.state.userId);
    },
    refreeted() {
      if (this.freet === undefined) return [];
      return this.freet.refreeters.includes(this.$store.state.userId);
    },
    downvoted() {
      if (this.freet === undefined) return [];
      return this.freet.downvoters.includes(this.$store.state.userId);
    },
    toxicityPercentage(){
      if (this.freet.viewers.length === 0) return 0;
      return (this.freet.downvoters.length / this.freet.viewers.length) *100;
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
        this.$emit('refresh');
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
        this.$emit('refresh');

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
        this.$emit('refresh');
        this.editing = false;
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async likeRequest() {
        try {
          const fields = {freetId: this.freet._id};
          const r = await  fetch('/api/likes', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}});
          if (!r.ok) {
            const res = await r.json();
            throw new Error(res.error);
          }
          this.addNotification("like");
          this.$emit('refresh');
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
      },
      async removeLikeRequest() { {
        try {
          const r = await fetch(`/api/likes?freetId=${ this.freet._id}`, {method: 'DELETE'})
          if (!r.ok) {
            const res = await r.json();
            throw new Error(res.error);
          }
          this.deleteNotification("like");
          this.$emit('refresh');
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
      }
    },
    async refreetRequest() {
        try {
        const fields = {freetId: this.freet._id};
        const r = await  fetch('/api/refreets', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}});
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        this.addNotification("refreet");
        this.$emit('refresh');
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
      },
       async removeRefreetRequest()  {
          try {
          const r = await fetch(`/api/refreets?freetId=${this.freet._id}`, {method: 'DELETE'})
          if (!r.ok) {
            const res = await r.json();
            throw new Error(res.error);
          }
          this.deleteNotification("refreet");
          this.$emit('refresh');
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
    },
    async downvoteRequest() {
        try {
        const fields = {freetId: this.freet._id};
        const r = await  fetch('/api/downvotes', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}});
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        this.$emit('refresh');

      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
      async removeDownvoteRequest(){
        try {
        const r = await fetch(`/api/downvotes?freetId=${ this.freet._id}`, {method: 'DELETE'})
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        this.$emit('refresh');

      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async hideFreet(){
      try {
        const fields = {freetId: this.freet._id};
        const r = await  fetch('/api/hiddenfreets', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}});
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        this.$emit('refresh');
    }
    catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
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

.toxicity {
  font-size:10pt;
  color: #898b8c;
  font-family: Arial, Helvetica, sans-serif
}

.refreet {
  font-size:10pt;
  color: #898b8c;
  font-family: Arial, Helvetica, sans-serif;
  margin-left: 70px;
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
