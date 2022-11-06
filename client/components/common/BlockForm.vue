<!-- Reusable component representing a form in a block style -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <form
    @submit.prevent="submit"
  >
    <h3>{{ title }}</h3>
    <article
      v-if="fields.length"
    >
      <div
        v-for="field in fields"
        :key="field.id"
      >
        <label :for="field.id">{{ field.id === 'content' ? "" : field.label+":" }}</label>
        <textarea
          v-if="field.id === 'content'"
          rows="8"
          :name="field.id"
          :value="field.value"
          placeholder="What's on your mind?"
          @input="field.value = $event.target.value"
        />
        <input
          v-else
          :type="field.id === 'password' ? 'password' : 'text'"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
        >
      </div>
    </article>
    <article v-else>
      <p>{{ content }}</p>
    </article>
    <button
      type="submit"
    >
      {{ title }}
    </button>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </form>
</template>

<script>

export default {
  name: 'BlockForm',
  data() {
    /**
     * Options for submitting this form.
     */
    return {
      url: '', // Url to submit form to
      method: 'GET', // Form request method
      hasBody: false, // Whether or not form request has a body
      setUsername: false, // Whether or not stored username should be updated after form submission
      refreshFreets: false, // Whether or not stored freets should be updated after form submission,
      refreshComments: false, // Whether or not stored freets should be updated after form submission
      alerts: {}, // Displays success/error messages encountered during form submission
      callback: null, // Function to run after successful form submission
      freetId: null
    };
  },
  methods: {
    async submit() {
      /**
        * Submits a form with the specified options from data().
        */
      const options = {
        method: this.method,
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin' // Sends express-session credentials with request
      };
      if (this.hasBody) {
        const req_fields = [...this.fields];

        if (this.freetId) {
          req_fields.push({id: 'freetId', value: this.freetId});
        }
        options.body = JSON.stringify(Object.fromEntries(
          req_fields.map(field => {
            const {id, value} = field;
            field.value = '';
            return [id, value];
          })
        ));
      }

      try {
        const r = await fetch(this.url, options);
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          throw new Error(res.error);
        }

        if (this.setUsername) {
          const text = await r.text();
          const res = text ? JSON.parse(text) : {user: null};
          this.$store.commit('setUsername', res.user ? res.user.username : null);
          this.$store.commit('setUserId', res.user ? res.user._id : null);
        }

        if (this.refreshFreets) {
          this.$store.commit('refreshFreets');
        }

        if (this.refreshComments) {
          this.$store.commit('refreshComments');
        }

        if (this.callback) {
          this.callback();
        }
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
form {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 14px;
  position: relative;
  background-color: #fff;
  box-shadow: 0px 2px 5px rgb(141, 156, 160);
  border-radius: 5px;
}

article > div {
  display: flex;
  flex-direction: column;
}

form > article p {
  margin: 0;
}

form h3,
form > * {
  margin: 0.3em 0;
}

form h3 {
  margin-top: 0;
  color: #24b2e1;
  font-family: Arial, Helvetica, sans-serif;
}

button {
  width: 200px;
  height:30px;
  margin: auto;
  background-color: #24b2e1;
  color: white;
  border: 2px solid #24b2e1; 
  border-radius: 5px;
  padding-left:5px;
  padding-right:5px;
  box-shadow: 0px 1px 2px rgb(141, 156, 160);
  font-size: 15px;
}

textarea {
  font-family: Arial, Helvetica, sans-serif;
   font-size: inherit;
   border-radius: 5px;
   margin-top: 10px;
   padding: 10px;
}

label {
  font-family: Arial, Helvetica, sans-serif;
}
input{
  height: 30px;
  margin-top: 20px;
  margin-bottom: 20px;
}

</style>
