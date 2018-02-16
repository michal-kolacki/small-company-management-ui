<template>
    <form @submit.prevent="createTaskLog(taskId)">
        <div class="row">
            <div class="form-group col-sm-6">
                <label>Time (sec): {{formatTime(taskLog.time)}}</label>
                <input v-model="taskLog.time" type="text" class="form-control margin-bottom-5" />

                Put time:
                <button v-for="prT in predefinedTimes"
                        type="button"
                        @click="putTime(prT.time)"
                        class="btn btn-xs btn-default margin-left-5">{{prT.label}}</button>
            </div>

            <div class="form-group col-sm-6">
                <label>Comment:</label>
                <textarea v-model="taskLog.comment" class="form-control"></textarea>
            </div>

            <div class="col-sm-12 buttons">
                <button type="submit"
                        class="btn btn-md btn-warning pull-right">Cancel</button>

                <input type="submit" value="Create"
                       class="btn btn-md btn-primary pull-right" />

                <button v-if="!this.timer"
                        type="button"
                        class="btn btn-md btn-success pull-right"
                        @click="startTimer">
                    <i class="glyphicon glyphicon-time"></i> Start timer
                </button>

                <button v-if="this.timer"
                        type="button"
                        class="btn btn-md btn-danger pull-right"
                        @click="stopTimer">
                    <i class="glyphicon glyphicon-time"></i> Stop timer
                </button>
            </div>
        </div>
    </form>
</template>

<script>
import axios from 'axios';

export default {
  name: 'TaskLogCreateForm',
  props: ['taskId'],
  data() {
    return {
      timer: null,
      taskLog: {
        time: 0,
        comment: '',
      },
      predefinedTimes: [
        { time: 30, label: '30 min' },
        { time: 60, label: '60 min' },
        { time: 90, label: '1.5 hrs' },
        { time: 120, label: '2 hrs' },
        { time: 150, label: '2.5 hrs' },
        { time: 180, label: '3 hrs' },
        { time: 0, label: 'clear' },
      ],
    };
  },
  methods: {
    createTaskLog(taskId) {
      this.stopTimer();
      this.taskLog.task_id = parseInt(taskId, 10);
      axios.post(`${this.$config.API}/tasklogs`, this.taskLog)
        .then((taskLog) => {
          // TODO: add message component to display ok message
          this.taskLog = { time: 0 };
          this.$emit('created-task-log', taskLog.data);
        });
    },
    startTimer() {
      this.timer = setInterval(() => {
        this.taskLog.time = parseInt(this.taskLog.time, 10) + 1;
      }, 1000);
    },
    stopTimer() {
      clearInterval(this.timer);
      this.timer = null;
    },
    putTime(minutes) {
      this.taskLog.time = minutes * 60;
    },
  },
};
</script>

<style>
.margin-bottom-5 {
    margin-bottom: 5px;
}

.margin-left-5 {
    margin-left: 5px;
}

.buttons .btn {
    margin-left: 10px;
}
</style>