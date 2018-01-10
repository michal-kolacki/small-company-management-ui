<template>
    <div class="row">
        <div class="col-md-12">
            <h1>Tasks <button @click="openCreateTaskForm" class="btn btn-primary">Add task</button></h1>

            <div v-if="showCreateTaskForm">
                <form>
                    <input type="text" v-model="task.number" />
                    <input type="text" v-model="task.name" />
                    <input type="text" v-model="task.content" />
                </form>
            </div>

            <table class="table table-striped">
                <thead>
                    <tr>
                        <td>Number</td>
                        <td>Name</td>
                        <td>State</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="task in tasks">
                        <td>{{task.number}}</td>
                        <td>{{task.name}}</td>
                        <td>{{task.state_id}}</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Tasks',
  data() {
    return {
      showCreateTaskForm: false,
      tasks: [],
      task: {
        number: '',
        name: '',
        content: '',
      },
    };
  },
  methods: {
    openCreateTaskForm() {
      this.showCreateTaskForm = true;
    },
  },
  created() {
    axios.get(`${this.$config.API}/projects/${this.$route.params.id}/tasks`)
      .then((results) => {
        this.tasks = results.data;
      });
  },
};
</script>