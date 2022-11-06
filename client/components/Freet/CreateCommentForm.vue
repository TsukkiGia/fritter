<!-- Form for creating freets (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateCommentForm',
  mixins: [BlockForm],
  props: {
        freet: {
          type: Object,
          required: true
        }
      },
  data() {
    return {
      url: `/api/freets/${this.freet._id}/comments`,
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'content', label: 'Content', value: ''}
      ],
      title: 'Create a comment',
      refreshComments: true,
      freetId: this.freet._id,
      callback: () => {
        const message = 'Successfully created a comment!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>