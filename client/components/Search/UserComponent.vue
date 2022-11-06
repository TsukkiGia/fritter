<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="notification"
  >
    <div class="container">
      <div class="icon">
        <img 
          src="../../public/heart.png"
        >
      </div>
      <div class="content">
        <header>
          <h3> {{ user.displayName }}</h3>
          <h3> @{{ user.username }}</h3>
        </header>
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
        }
      },
      data() {
        return {
          alerts: {} 
        };
      }
    };
    </script>
    
    <style scoped>
    .notification {
        border: 1px solid #111;
        padding: 20px;
        position: relative;
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
    