<template>
    <div class="home">
        <p>首页的子组件</p>
        <p>{{parentdata}}</p>
        <button @click="sonFn">子组件按钮</button>
    </div>
</template>

<script>
// import Vue from 'vue'
// import Component from 'vue-class-component'

import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
@Component
export default class Son extends Vue {
    @Prop(String) parentdata;

    // 通过装饰器调用, 无需通过emit调用
    @Emit('parentFn')
    sonFn () {
      // 原来要传参, 就在后面加入参数
      // this.$emit('parentFn', 666)
      // 现在直接return的反回值就会传递给父组件的方法
      return 666
    }
}
</script>

<style scoped>

</style>
