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
                        <th width="70">&nbsp;</th>
                    </tr>
                </thead>
                <tbody v-for="task in tasks">
                    <tr>
                        <td>
                            <span  v-show="!task.editMode">{{project.code}}-{{task.number}}</span>
                            <input type="text"
                                   class="form-control"
                                   v-model="task.number"
                                   v-show="task.editMode" />
                        </td>
                        <td>
                            <span  v-show="!task.editMode">{{task.name}}</span>
                            <input type="text"
                                   class="form-control"
                                   v-model="task.name"
                                   v-show="task.editMode" />
                        </td>
                        <td>
                            <span  v-show="!task.editMode">{{getState(task.task_state_id)}}</span>
                            <select v-model="task.task_state_id"
                                    v-show="task.editMode"
                                    type="text" class="form-control">
                                <option v-for="state in states" :value="state.id">{{state.name}}</option>
                            </select>
                        </td>
                        <td>
                            <button class="btn btn-xs btn-default"
                                    type="button"
                                    v-show="!task.showLogs"
                                    @click="task.showLogs = true">
                                <i class="glyphicon glyphicon-folder-open"></i>
                            </button>

                            <button class="btn btn-xs btn-default"
                                    type="button"
                                    v-show="task.showLogs"
                                    @click="task.showLogs = false">
                                <i class="glyphicon glyphicon-remove"></i>
                            </button>

                            <button class="btn btn-xs btn-default"
                                    type="button"
                                    v-show="!task.editMode"
                                    @click="task.editMode = true">
                                <i class="glyphicon glyphicon-pencil"></i>
                            </button>

                            <button class="btn btn-xs btn-default"
                                    type="button"
                                    v-show="task.editMode"
                                    @click="task = updateTask(task)">
                                <i class="glyphicon glyphicon-floppy-save"></i>
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
      showStateSelect: {},
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
    updateTask(task) {
      const taskItem = task;
      const taskData = {
        id: taskItem.id,
        task_state_id: taskItem.task_state_id,
        number: taskItem.number,
        name: taskItem.name,
      };
      axios.put(`${this.$config.API}/tasks/${task.id}`, taskData)
        .then(() => {
          taskItem.editMode = false;
        });
      return taskItem;
    },
    getState(taskStateId) {
      const state = this.states.filter(st => st.id === taskStateId);
      return state && state[0] && state[0].name;
    },
  },
  created() {
    // get tasks list
    axios.get(`${this.$config.API}/projects/${this.$route.params.id}/tasks`)
      .then((results) => {
        this.tasks = results.data.map((task) => {
          const nTask = task;
          nTask.showLogs = false;
          nTask.editMode = false;
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