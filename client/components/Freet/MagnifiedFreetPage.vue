<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <main class="ha">
    <article
      v-if="freet"
      class="freet"
    >
    <h2>Freet</h2>
      <FreetComponent
        :key="freet._id"
        :freet="freet"
      />
      <section class="alerts">
        <article
          v-for="(status, alert, index) in alerts"
          :key="index"
          :class="status"
        >
          <p>{{ alert }}</p>
        </article>
      </section>
      <section class="comment">
        <CreateCommentForm 
          :key="freet.id"
          :freet="freet"
        />
      </section>
      <section
        v-if="$store.state.currentFreetComments.length"
      >
      <h1>Comments</h1>
        <FreetComponent
          v-for="comment in comments"
          :key="comment.id"
          :freet="comment"
        />
      </section>
    </article>
  </main>
</template>
  
  <script>
  import CreateCommentForm from '@/components/Freet/CreateCommentForm.vue';
  import FreetComponent from '@/components/Freet/FreetComponent.vue';

  export default {
    name: 'MagnifiedFreetPage',
    components: {CreateCommentForm, FreetComponent},
    data() {
      return {
        alerts: {}, // Displays success/error messages encountered during freet modification,
        freet: null,
        cream: false
      };
    },
    computed: {
      liked() {
        if (!this.freet) return [];
        return this.freet.likers.includes(this.$store.state.userId);
      },
      refreeted() {
        if (!this.freet) return [];
        return this.freet.refreeters.includes(this.$store.state.userId);
      },
      downvoted() {
        if (!this.freet) return [];
        return this.freet.downvoters.includes(this.$store.state.userId);
      },
      comments(){
        if (!this.freet) return [];
        return this.$store.state.currentFreetComments;
      }
     },
    mounted() {
        this.fetchFreet();
    },
    methods: {
      async addViewer(){
       try {
        const r = await  fetch(`/api/freets/${this.freet._id}`, {method: 'PUT', headers: {'Content-Type': 'application/json'}});
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
        async fetchFreet() {
          const url =`/api/freets/${this.$route.params.id}`;
          try {
            const r = await fetch(url);
            const res = await r.json();
            if (!r.ok) {
              throw new Error(res.error);
            }
            this.freet = res.freet;
            this.$store.commit('setCurrentFreetId', this.freet._id);
            this.$store.commit('refreshComments');
            await this.addViewer();
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
  
          await this.fetchFreet();
  
          params.callback();
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .freet {

      padding: 20px;
      position: relative;
      margin: auto;
  }
  .ha {
    width: 75%;
    margin: auto;
  }

  .comment {
    margin-top: 30px;
    margin-bottom: 0px;
  }

  h1,h2 {
    color: #24b2e1;
  font-family: Arial, Helvetica, sans-serif;
  }

  </style>
  