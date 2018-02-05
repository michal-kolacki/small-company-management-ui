const Utils = (Vue) => {
  Vue.mixin({
    methods: {
      formatTime(seconds) {
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
  });
};

export default Utils;
