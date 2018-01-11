<template>
    <div>
        <table class="table table-hover" v-if="logs.length && !loading">
            <tbody>
                <tr v-for="log in logs">
                    <td v-html="log.comment"></td>
                    <td>{{log.time}}</td>
                    <td>{{log.created}}</td>
                </tr>
            </tbody>
        </table>
        <span v-show="!logs.length && !loading">No logs found.</span>
        <span v-show="loading">Loading...</span>
    </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'TaskLogsList',
  props: ['taskId'],
  data() {
    return {
      loading: false,
      logs: [],
    };
  },
  methods: {
    getLogs(taskId) {
      this.loading = true;
      axios.get(`${this.$config.API}/tasks/${taskId}/logs`)
        .then((results) => {
          this.logs = results.data;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  created() {
    this.getLogs(this.taskId);
  },
};
</script>