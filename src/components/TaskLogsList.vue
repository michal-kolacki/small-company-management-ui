<template>
    <div>
        <table class="table table-hover" v-if="logs.length && !loading">
            <thead>
                <th>Log comment</th>
                <th>Time spent</th>
            </thead>
            <tbody>
                <tr v-for="log in logs">
                    <td v-html="log.comment"></td>
                    <td width="100">{{formatTime(log.time)}}</td>
                </tr>
                <tr>
                    <td>&nbsp;</td>
                    <td><strong>{{formatTime(timeSummed.time)}}</strong></td>
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
    formatTime(seconds) { // TODO: move to mixin
      let tmpTime = seconds;
      let h = parseInt(tmpTime / 60 / 60, 10);
      tmpTime -= h * 60 * 60;
      let m = parseInt(tmpTime / 60, 10);
      let s = tmpTime - (m * 60);

      h = h < 10 ? `0${h}` : h;
      m = m < 10 ? `0${m}` : m;
      s = s < 10 ? `0${s}` : s;

      return `${h}:${m}:${s}`;
    },
  },
  created() {
    this.getLogs(this.taskId);
  },
};
</script>