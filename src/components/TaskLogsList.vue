<template>
    <div>
        <table class="table table-hover" v-if="logs.length && !loading">
            <thead>
                <th>Log comment</th>
                <th>Time spent</th>
                <th>Created</th>
            </thead>
            <tbody>
                <tr v-for="log in logs">
                    <td v-html="log.comment"></td>
                    <td width="100">{{formatTime(log.time)}}</td>
                    <td width="100" v-html="getDateTime(log.created)"></td>
                </tr>
                <tr>
                    <td>&nbsp;</td>
                    <td><strong>{{formatTime(timeSummed.time)}}</strong></td>
                    <td>&nbsp;</td>
                </tr>
            </tbody>
        </table>

        <span v-show="!logs.length && !loading">No logs found.</span>
        <span v-show="loading">Loading...</span>

        <task-log-create-form :task-id="taskId"
                              @created-task-log="updateLogs"></task-log-create-form>
    </div>
</template>

<script>
import axios from 'axios';
import TaskLogCreateForm from './TaskLogCreateForm';

export default {
  name: 'TaskLogsList',
  props: ['taskId'],
  components: { TaskLogCreateForm },
  data() {
    return {
      loading: false,
      logs: [],
    };
  },
  computed: {
    timeSummed() {
      return this.logs.reduce((prev, curr) => ({ time: prev.time + curr.time }));
    },
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
    updateLogs(newTaskLog) {
      this.logs.push(newTaskLog);
    },
    getDateTime(created) {
      let datetime = '';
      const createdSplit = created.split('T');
      datetime += createdSplit[0];
      datetime += `<br />${createdSplit[1].split('+')[0]}`;
      return datetime;
    },
  },
  created() {
    this.getLogs(this.taskId);
  },
};
</script>