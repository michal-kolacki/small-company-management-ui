<template>
    <div class="row">
        <div class="col-md-12" v-if="task.id">

            <router-link v-if="task.project_id" :to="{ name: 'tasks', params: { id: task.project_id } }">
                <i class="glyphicon glyphicon-arrow-left"></i> Back to tasks list
            </router-link>

            <div class="alert alert-info" v-if="message.length">
                {{message}}
            </div>

            <h1>
                [{{task.number}}] {{task.name}}
                <button @click="editMode = true"
                        v-show="!editMode"
                        type="button"
                        class="btn btn-primary btn-sm"><i class="glyphicon glyphicon-pencil"></i> Edit task</button>
                <button @click="createTaskLogForm = true"
                        v-show="!createTaskLogForm"
                        type="button"
                        class="btn btn-primary btn-sm"><i class="glyphicon glyphicon-plus-sign"></i> Create task log</button>
                <button @click="createTaskLogForm = false"
                        v-show="createTaskLogForm"
                        type="button"
                        class="btn btn-warning btn-sm">Cancel creating task log</button>
            </h1>


            <span class="label label-info" v-show="!editMode">{{getState(task.task_state_id)}}</span>
            <p v-html="task.content" v-show="!editMode"></p>

            <div class="row" v-if="editMode">
                <div class="col-md-6">
                    <div class="form-group">
                        <input type="text" class="form-control" v-model="task.name" />
                    </div>

                    <div class="form-group">
                        <select v-model="task.task_state_id"
                                type="text" class="form-control">
                            <option v-for="state in states" :value="state.id">{{state.name}}</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <textarea v-model="task.content" class="form-control"></textarea>
                    </div>
                    <div class="form-group">
                        <button class="btn btn-md btn-success pull-right" @click="updateTask(task)">Save</button>
                    </div>
                </div>
                <div class="col-md-12">
                    <hr />
                </div>
            </div>

            <task-log-create-form v-if="createTaskLogForm"
                                  @created-task-log="updateLogs"
                                  :task-id="task.id"></task-log-create-form>

            <task-logs-list :logs="logs"></task-logs-list>



        </div>
    </div>
</template>

<script>
import axios from 'axios';
import TaskLogsList from './TaskLogsList';
import TaskLogCreateForm from './TaskLogCreateForm';

export default {
  name: 'TaskLogs',
  components: { TaskLogsList, TaskLogCreateForm },
  data() {
    return {
      message: '',
      editMode: false,
      createTaskLogForm: false,
      task: {},
      states: [],
      logs: [],
    };
  },
  methods: {
    getState(taskStateId) {
      const state = this.states.filter(st => st.id === taskStateId);
      return state && state[0] && state[0].name;
    },
    updateLogs(newTaskLog) {
      this.logs.push(newTaskLog);
      this.createTaskLogForm = false;
    },
    updateTask(task) {
      const taskItem = task;
      const taskData = {
        id: taskItem.id,
        task_state_id: taskItem.task_state_id,
        name: taskItem.name,
        content: taskItem.content,
      };
      axios.put(`${this.$config.API}/tasks/${task.id}`, taskData)
        .then(() => {
          this.editMode = false;
        })
        .catch((error) => {
          this.message = error;
        });
      return taskItem;
    },
    nl2br(str, isXhtml = true) {
      const breakTag = (isXhtml || typeof isXhtml === 'undefined') ? '<br />' : '<br>';
      return str.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
    },
  },
  created() {
    // axios.interceptors.response.use(
    //   (test) => { console.log(test); },
    //   (testt) => { console.log(testt); },
    // );

    // get project details
    axios.get(`${this.$config.API}/tasks/${this.$route.params.tid}`)
      .then((task) => {
        this.task = task.data;
        this.task.content = this.nl2br(this.task.content);
      })
      .catch((error) => {
        this.message = error;
      });

    axios.get(`${this.$config.API}/tasks/${this.$route.params.tid}/logs`)
      .then((results) => {
        this.logs = results.data;
      })
      .catch((error) => {
        this.message = error;
      });

    // get task states
    axios.get(`${this.$config.API}/taskstates`)
      .then((states) => {
        this.states = states.data;
      })
      .catch((error) => {
        this.message = error;
      });
  },
};
</script>
