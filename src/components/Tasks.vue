<template xmlns="http://www.w3.org/1999/html">
    <div class="row">
        <div class="col-md-12">
            <router-link :to="{ name: 'projects' }">
                <i class="glyphicon glyphicon-arrow-left"></i> Back to projects
            </router-link>

            <h1>
                Tasks for {{project.name}}
                <button @click="createTaskForm = true"
                        v-show="!createTaskForm"
                        type="button"
                        class="btn btn-primary">Create task</button>
            </h1>

            <span class="label label-info">Total time spent on project: <strong>{{formatTime(project.time)}}</strong></span>

            <form v-if="createTaskForm" @submit.prevent="createTask">
                <div class="form-group">
                    <label>Task name:</label>
                    <input v-model="task.name" type="text" class="form-control" />
                </div>

                <div class="form-group">
                    <label>Description:</label>
                    <textarea v-model="task.content" class="form-control"></textarea>
                </div>

                <div class="form-group">
                    <label>State:</label>
                    <select v-model="task.task_state_id" type="text" class="form-control">
                        <option v-for="state in states" :value="state.id">{{state.name}}</option>
                    </select>
                </div>
                <input type="submit" value="Create" class="btn btn-md btn-primary" />
                <button type="button"
                        class="btn btn-md btn-warning"
                        @click="createTaskForm = false">
                    Cancel
                </button>
                <hr />
            </form>


            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Number</th>
                        <th>Name</th>
                        <th>State</th>
                        <th width="50">Logs</th>
                    </tr>
                </thead>
                <tbody v-for="task in tasks">
                    <tr>
                        <td>{{project.code}}-{{task.number}}</td>
                        <td>{{task.name}}</td>
                        <td>{{getState(task.task_state_id)}}</td>
                        <td>
                            <button class="btn btn-xs btn-info"
                                    type="button"
                                    v-show="!task.showLogs"
                                    @click="task.showLogs = true">
                                <i class="glyphicon glyphicon-folder-open"></i>
                            </button>

                            <button class="btn btn-xs btn-warning"
                                    type="button"
                                    v-show="task.showLogs"
                                    @click="task.showLogs = false">
                                <i class="glyphicon glyphicon-remove"></i>
                            </button>
                        </td>
                    </tr>
                    <tr v-if="task.showLogs">
                        <td colspan="4">
                            <task-logs-list :task-id="task.id"></task-logs-list>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import TaskLogsList from './TaskLogsList';

export default {
  name: 'Tasks',
  components: { TaskLogsList },
  data() {
    return {
      createTaskForm: false,
      message: '',
      project: {},
      states: [],
      tasks: [],
      openedTaskLogs: {},
      task: {
        name: '',
        content: '',
        task_state_id: '',
      },
    };
  },
  methods: {
    createTask() {
      this.task.project_id = parseInt(this.$route.params.id, 10);
      axios.post(`${this.$config.API}/tasks`, this.task)
        .then((results) => {
          if (results && results.data) {
            const newlyCreatedTask = results.data;
            newlyCreatedTask.showLogs = false;
            this.tasks.push(newlyCreatedTask);
          }
          this.createTaskForm = false;
          this.task = {};
          this.message = 'Task has been created.'; // TODO: modify it to have separated component
        })
        .catch((error) => {
          this.message = error.response.data.message;
        });
    },
    getState(taskStateId) {
      const state = this.states.filter(st => st.id === taskStateId);
      return state && state[0] && state[0].name;
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
    // get tasks list
    axios.get(`${this.$config.API}/projects/${this.$route.params.id}/tasks`)
      .then((results) => {
        this.tasks = results.data.map((task) => {
          const nTask = task;
          nTask.showLogs = false;
          return nTask;
        });
      });

    // get project details
    axios.get(`${this.$config.API}/projects/${this.$route.params.id}`)
      .then((project) => {
        this.project = project.data;
      });

    // get task states
    axios.get(`${this.$config.API}/taskstates`)
      .then((states) => {
        this.states = states.data;
      });
  },
};
</script>