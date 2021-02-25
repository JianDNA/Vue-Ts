<template>
    <div class="register_container">
      <div class="register_box">
        <h1>欢迎注册</h1>
        <el-tabs tab-position="left" >
          <el-tab-pane label="普通注册">
            <p>普通注册</p>
          </el-tab-pane>
          <el-tab-pane label="邮箱注册">
            <p>邮箱注册</p>
          </el-tab-pane>
          <el-tab-pane  label="手机注册">
            <p>手机注册</p>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
// 如果在类中找不到需要添加的内容,name就可以写在这个地方
  name: 'Register',
  components: {}
})
export default class Register extends Vue {

}
</script>

<style lang="scss" scoped>
.register_container{
  width: 100%;
  height: 100%;
  background: url("../assets/bg.jpg") no-repeat;
  background-size: cover;
  position: relative;
  .register_box{
    width: 600px;
    height: 450px;
    background: #fff;
    border-radius: 10px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    h1{
      text-align: center;
    }
    a{
      text-decoration: none;
    }
    .el-form{
      padding-right: 20px;
      box-sizing: border-box;
    }
  }
}
</style>
