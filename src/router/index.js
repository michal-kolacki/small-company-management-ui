import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/components/Home';
import Projects from '@/components/Projects';
import Tasks from '@/components/Tasks';
import TaskLogs from '@/components/TaskLogs';

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/projects',
      name: 'projects',
      component: Projects,
    },
    {
      path: '/projects/:id/tasks',
      name: 'tasks',
      component: Tasks,
    },
    {
      path: '/tasks/:tid/logs',
      name: 'taskLogs',
      component: TaskLogs,
    },
  ],
});
