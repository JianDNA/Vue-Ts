<template>
  <div class="home">
    <p>首页</p>
    <p>{{msg}}</p>
    <button @click="myFn">我是父组件按钮</button>
    <p>{{message}}</p>
    <p>{{message}}</p>
    <p>{{message}}</p>
    <Son :parentdata="msg" @parentFn="myFn"></Son>
  </div>
</template>

<script>
// @ is an alias to /src
import Son from '@/components/Normal-Son'
export default {
  name: 'Home',
  components: {
    Son
  },
  // 数据绑定
  data: function () {
    return {
      msg: 'hzj666',
      str: '1109632473'
    }
  },
  // 方法绑定
  methods: {
    myFn: function () {
      alert('vusn@qq.com')
    }
  },
  // 计算属性
  computed: {
    message () {
      console.log('执行了')
      return this.str.split('').reverse().join('')
    }
  },
  // 观察属性
  watch: {
    msg (newValue, oldValue) {
      console.log(newValue, oldValue)
    }
  }
  // 传递数据给子组件
  // 传递方法
}
</script>
