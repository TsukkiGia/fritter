<template>
  <section>
    <h1>Delete all freets before this date</h1>
    <form @submit.prevent="submit">
      <input
        v-model="deadlineDate"
        type="date"
        class="datePicker"
      >
      <input
        class="submitter"
        type="submit"
      >
    </form>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </section>
</template>
      
<script>

export default {
name: 'DatePicker',
data() {
    return {
        deadlineDate: "",
        alerts: {}
    }
},
methods: {
    async submit() {
        if (this.deadlineDate !== ""){
            let [y, m, d] = this.deadlineDate.split('-');
            const fields = {deadlineYear: y, deadlineMonth: m, deadlineDay: d};
            const options = {method: "PUT", headers: {'Content-Type': 'application/json'}, body: JSON.stringify(fields)};
            const url = `/api/freets`;
            try {
                const r = await fetch(url, options);
                const res = await r.json();
                if (!r.ok) {
                    throw new Error(res.error);
                }
                alert("You have successfully deleted your Freets before "+ this.deadlineDate);
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