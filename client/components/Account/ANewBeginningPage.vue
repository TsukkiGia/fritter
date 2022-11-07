<template>
  <article>
    <section v-if="$store.state.username">
      <header>
        <h2>@{{ $store.state.username }}'s New Beginning </h2>
      </header>
      <DatePicker />
    </section>
    <section v-else>
      <header>
        <h2>Welcome to Fritter!</h2>
      </header>
      <article>
        <h3>
          <router-link to="/login">
            Sign in
          </router-link>
          to view a new beginning.
        </h3>
      </article>
    </section>
  </article>
</template>
    
    <script>
     import DatePicker from './DatePicker.vue';
    export default {
      name: 'ANewBeginningPage',
      components: {DatePicker},
    };
    </script>
    
    <style scoped>
  h1 {
    color: #24b2e1;
  font-family: Arial, Helvetica, sans-serif;
  }

  .datePicker {

    font-size: 20px;
    width:50%;
  }
  .submitter {
    background-color: #24b2e1;
  color: white;
  border: 2px solid #24b2e1; 
  border-radius: 5px;
  padding-left:5px;
  padding-right:5px;
  box-shadow: 0px 1px 2px rgb(141, 156, 160);
  font-size: 20px;
  margin-left: 50px;
  }
  
    </style>