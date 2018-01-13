<template>
    <div>
        <h1>
            Projects
            <button @click="createProjectForm = true"
                    v-show="!createProjectForm"
                    class="btn btn-primary">Create project</button>
        </h1>


        <form v-if="createProjectForm" @submit.prevent="createProject">
            <div class="form-group">
                <label>Project name:</label>
                <input v-model="project.name" type="text" class="form-control" />
            </div>

            <div class="form-group">
                <label>Project code:</label>
                <input v-model="project.code" type="text" class="form-control" />
            </div>

            <div class="form-group">
                <label>Client:</label>
                <input v-model="project.client_id" type="text" class="form-control" />
            </div>
            <input type="submit" value="Create" class="btn btn-md btn-primary" />
            <input type="button" value="Cancel" class="btn btn-md btn-warning"
                   @click="createProjectForm = false" />
            <hr />
        </form>

        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Name</th>
                    <th width="50">Tasks</th>
                    <th width="50">Delete</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="pr in projects">
                    <td>{{pr.name}}</td>
                    <td>
                        <router-link :to="{ name: 'tasks', params: { id: pr.id} }"
                                     class="btn btn-default btn-xs">
                            <i class="glyphicon glyphicon-list"></i>
                        </router-link>
                    </td>
                    <td>
                        <button @click="deleteProject(pr.id)"
                                class="btn btn-default btn-xs">
                            <i class="glyphicon glyphicon-remove"></i>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Projects',
  data() {
    return {
      createProjectForm: false,
      message: '',
      projects: [],
      project: {
        name: '',
        code: '',
        client_id: 0,
      },
    };
  },
  methods: {
    getProjects() {
      this.projects = [];
      axios.get(`${this.$config.API}/projects`)
        .then((results) => {
          this.projects = results.data;
        })
        .catch((error) => {
          this.message = error.response.data.message;
        });
    },
    createProject() {
      axios.post(`${this.$config.API}/projects`, this.project)
        .then((results) => {
          this.projects.push(results.data);
          this.createProjectForm = false;
          this.project = {};
          this.message = 'Project has been created.'; // TODO: modify it to have separated component
        })
        .catch((error) => {
          this.message = error.response.data.message;
        });
    },
    updateProject() {
      // TODO:
    },
    deleteProject(id) {
      axios.delete(`${this.$config.API}/projects/${id}`)
        .then(() => {
          this.projects = this.projects.filter(pr => pr.id !== id);
        })
        .catch((error) => {
          this.message = error.response.data.message;
        });
    },
  },
  created() {
    this.getProjects();
  },
};
</script>