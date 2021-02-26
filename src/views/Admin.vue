<template>
    <div class="">
      <el-button @click="myFn">我是按钮</el-button>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { getUsers } from '../api/index'
@Component({
// 如果在类中找不到需要添加的内容,name就可以写在这个地方
  name: 'Admin',
  components: {}
})
export default class Admin extends Vue {
  private myFn () {
    console.log(66)
    getUsers()
      .then(data => {
        console.log(data)
      })
      .catch(e => {
        console.log(e)
      })
  }
}
</script>

<style lang="scss" scoped>

</style>
