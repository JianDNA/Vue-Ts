<template>
  <div class="son">
    <p>首页子组件</p>
    <p>{{parentdata}}</p>
    <button @click="sonFn">子组件按钮</button>
  </div>
</template>

<script>

export default {
  name: 'Son',
  components: {},
  props: {
    parentdata: {
      type: String
    }
  },
  methods: {
    sonFn () {
      this.$emit('parentFn')
    }
  }
}
</script>
