<template>
  <div>
      <ul>
          <li v-for="item in list" :key="item.id">{{item.name}}</li>
      </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
        list: [
            {
                id: 1,
                name: 'tom'
            },
            {
                id: 2,
                name: 'jack'
            }
        ]
    };
  },
  mixins: [],
  extends: {},
  props: {},
  watch: {},
  components: {},
  computed: {},
  created() {},
  mounted() {},
  methods: {}
};
</script>
<style lang='scss' scoped>
</style>