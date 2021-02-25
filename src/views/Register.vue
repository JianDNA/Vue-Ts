<template>
    <div class="register_container">
      <div class="register_box">
        <h1>欢迎注册</h1>
        <el-tabs :tab-position="'left'" :stretch="true">
          <el-tab-pane label="普通注册">
            <el-form ref="form" :model="registerData " label-width="0px">
              <el-form-item label="">
                <el-input prefix-icon="el-icon-user" v-model="registerData.username"></el-input>
              </el-form-item>
              <el-form-item label="">
                <el-input prefix-icon="el-icon-lock" v-model="registerData.password"></el-input>
              </el-form-item>
              <el-form-item label="">
                <el-row>
                  <el-col :span="18">
                    <el-input prefix-icon="el-icon-lock" v-model="registerData.captcha"></el-input>
                  </el-col>
                  <el-col :span="6">
                    <img src="" alt="" style="width: 100%; height: 40px">
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit" style="width: 100%">注册</el-button>
              </el-form-item>
              <el-form-item>
                <el-checkbox v-model="registerData.checked">
                  <p>阅读并接受
                    <a href="javascript:;">《xxx用户协议》</a>
                    及
                    <a href="javascript:;">《xxx隐私权保护申明》</a>
                  </p>
                </el-checkbox>
              </el-form-item>
            </el-form>
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
  registerData = {
    username: '',
    password: '',
    captcha: '',
    registerType: 'normal',
    checked: true
  }

  onSubmit () {
    console.log(66)
  }
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
