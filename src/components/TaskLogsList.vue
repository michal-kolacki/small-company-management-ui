<template>
    <div class="row">
        <div class="col-md-12">
            <table class="table table-hover" v-if="logs.length && !loading">
                <thead>
                    <th>Log comment</th>
                    <th>Time spent</th>
                    <th class="text-center">Created</th>
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

            <div v-show="!logs.length && !loading" class="alert alert-info">No logs found.</div>
            <span v-show="loading">Loading...</span>
        </div>
    </div>
</template>

<script>
export default {
  name: 'TaskLogsList',
  props: ['logs'],
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    timeSummed() {
      return this.logs.reduce((prev, curr) => ({ time: prev.time + curr.time }));
    },
  },
  methods: {
    getDateTime(created) {
      let datetime = '';
      const createdSplit = created.split('T');
      datetime += createdSplit[0];
      datetime += `<br />${createdSplit[1].split('+')[0]}`;
      return datetime;
    },
  },
};
</script>