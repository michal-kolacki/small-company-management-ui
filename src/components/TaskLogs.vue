<template>
    <div class="row">
        <div class="col-md-12">
            <router-link v-if="task.project_id" :to="{ name: 'tasks', params: { id: task.project_id } }">
                <i class="glyphicon glyphicon-arrow-left"></i> Back to tasks list
            </router-link>

            <h1>
                {{task.name}}
                <button @click="createTaskLogForm = true"
                        v-show="!createTaskLogForm"
                        type="button"
                        class="btn btn-primary">Create task log</button>
            </h1>
            <p>{{getState(task.task_state_id)}}</p>
            <p v-html="task.content"></p>

            <div class="row">
                <div class="col-md-12">
                    <task-log-create-form v-if="createTaskLogForm"
                                          :task-id="task.id"></task-log-create-form>
                </div>
            </div>

            <task-logs-list v-if="task.id" :task-id="task.id"></task-logs-list>

            <!--<select v-model="task.task_state_id"
                    v-show="task.editMode"
                    type="text" class="form-control">
                <option v-for="state in states" :value="state.id">{{state.name}}</option>
            </select>-->

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
      createTaskLogForm: false,
      task: {},
      states: [],
    };
  },
  methods: {
    getState(taskStateId) {
      const state = this.states.filter(st => st.id === taskStateId);
      return state && state[0] && state[0].name;
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
  },
  created() {
    // get project details
    axios.get(`${this.$config.API}/tasks/${this.$route.params.tid}`)
      .then((task) => {
        this.task = task.data;
      });

    // get task states
    axios.get(`${this.$config.API}/taskstates`)
      .then((states) => {
        this.states = states.data;
      });
  },
};
</script>