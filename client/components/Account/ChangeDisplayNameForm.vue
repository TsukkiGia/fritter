<!-- Form for changing password (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'ChangeDisplayNameForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/users',
      method: 'PUT',
      hasBody: true,
      fields: [
        {id: 'displayName', label: 'Display Name', value: ''}
      ],
      title: 'Change display name',
      callback: () => {
        const message = 'Successfully changed display name!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
