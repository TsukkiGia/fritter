<!-- Reusable component representing a form in a block style -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <aside>
    <button
      v-if="!isActive"
      @click="positiveCallback"
    > 
      {{ positiveMessage }}
    </button>
  
    <button
      v-if="isActive"
      @click="negativeCallback"
    > 
      {{ negativeMessage }}
    </button>
  </aside>
</template>
    
  <script>
    export default {
      name: 'ActionButton',
      props: {
      positiveMessage: {
        type: String,
        required: true
      },
      negativeMessage: {
        type: String,
        required: true
      },
      positiveCallback: {
        type: Function,
        required: true
      },
      negativeCallback: {
        type: Function,
        required: true
      },
      freet: {
        type: Object,
        required: true
      },
      field: {
        type: String,
        required: true
    }
  },
      data() {
        return {
          alerts: {},
        };
      },
      computed: {
        isActive() {
            if (!this.freet) return false;
            return this.freet[this.field].includes(this.$store.state.userId);
        }}   
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
  margin-top: 10px;
  margin-right: 15px;
}
    
   </style>
    
  