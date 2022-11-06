<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <div class="container">
      <div> Make your account private</div>
      <div> 
        <label class="switch">
          <input
            type="checkbox"
            :checked="user.isPrivate === 'true'"
            @click="userPrivacy"
          >
          <span class="slider round" />
        </label>
      </div>
    </div>
    <p> Making your account private hides your Freets from search and limits your profile to your followers.</p>
  </main>
</template>
  

  <script>
  
  export default {
    name: 'PrivatePage',
    data() {
        return {
            user: {isPrivate: 'false'}
        }
    },
    mounted(){
        this.fetchUser()
    },
    methods: {
        async userPrivacy(){
        const fields = {isPrivate: this.user.isPrivate === 'false' ? 'true' : 'false'}
          const options = {method: "PUT", headers: {'Content-Type': 'application/json'}, body: JSON.stringify(fields)};
          const url = `/api/users`;
          try {
            const r = await fetch(url, options);
            const res = await r.json();
            if (!r.ok) {
                throw new Error(res.error);
            }
            await this.fetchUser();
            } catch (e) {
            
    
            this.$set(this.alerts, e, 'error');
            setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        },
        async fetchUser() {
            const url =`/api/users/${this.$store.state.userId}`;
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
  /* Code from https://www.w3schools.com/howto/howto_css_switch.asp */
/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
.container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
  width: 100%;
}
  </style>
  