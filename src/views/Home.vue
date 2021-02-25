<template>
  <div class="home">
    <p>首页</p>
    <p>{{message}}</p>
    <button @click="myFn">我是父组件的按钮</button>
    <p>{{msg}}</p>
    <p>{{msg}}</p>
    <p>{{msg}}</p>
    <Son :parentdata="msg" @parentFn="myFn"></Son>
  </div>
</template>

<script>
// https://class-component.vuejs.org/
// import Vue from 'vue'
// import Component from 'vue-class-component'

// 也可以通过vue-property-decorator这个库导入Vue和Component, 他提供了更多的语法
// https://www.npmjs.com/package/vue-property-decorator
import { Vue, Component, Watch } from 'vue-property-decorator'
import Son from '../components/Son'

@Component({
  // 如果在类中找不到需要添加的内容,name就可以写在这个地方
  name: 'Home',
  components: {
    Son
  }
})
export default class Home extends Vue {
  // Declared as component data
  // 数据绑定
  // 如果是通过类的方式定义组件, 那么类中的属性就是过去data中定义的数据
  message = 'hzj'
  str = '12345678';

  // 方法绑定
  // 如果是通过类的方式定义组件, 那么类中的方法,就是过去method中定义的方法
  myFn (data) {
    alert('vusn@qq.com')
  }

  // 计算属性
  // 如果是通过类的方式定义组件, 那么类中的getter方法就是过去的computed中的方法
  get msg () {
    console.log('执行了')
    return this.str.split('').reverse().join('')
  }

  // 观察属性
  /**
   * 第一个参数:   需要观察的属性名称
   * 第二个参数:   可选配置,如果deep为true,表示深度监听
   */
  @Watch('message', { deep: true })
  messageChange (newValue, oldValue) {
    console.log(newValue, oldValue)
  }
}
</script>
