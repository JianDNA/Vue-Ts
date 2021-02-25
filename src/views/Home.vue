<template>
  <div class="home">
    <p>首页</p>
    <p>{{message}}</p>
    <button @click="myFn">我是按钮</button>
    <p>{{msg}}</p>
    <Son :parentdata="message" @parentFn="myFn"/>
  </div>
</template>

<script>
import Son from '@/components/Son'
export default {
  name: 'Home',
  components: {
    Son
  },
  // 数据绑定
  data: function () {
    return {
      message: 'hzj'
    }
  },
  // 方法绑定
  methods: {
    myFn () {
      console.log(666)
    }
  },
  // 计算属性
  computed: {
    msg () {
      console.log('执行了')
      return this.message.split('').reverse().join('')
    }
  },
  // 观察属性
  watch: {
    message: function (newValue, oldValue) {
      console.log(newValue, oldValue)
    }
  }

}
</script>
