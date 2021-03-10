<template>
  <div class="login_container">
    <div class="login_box">
      <h1 @click="myFn">欢迎登陆</h1>
      <el-form ref="form" :model="loginData" :rules="loginRules" label-width="0px">
        <!--  添加校验规则 2. 为表单项指定prop-->
        <el-form-item label="" prop="username">
          <el-input prefix-icon="el-icon-user" v-model="loginData.username"></el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input prefix-icon="el-icon-lock" type="password" v-model="loginData.password"></el-input>
        </el-form-item>
        <el-form-item label="" prop="captcha">
          <el-row>
            <el-col :span="18">
              <el-input prefix-icon="el-icon-lock" v-model="loginData.captcha"></el-input>
            </el-col>
            <el-col :span="6">
              <img src="http://127.0.0.1:7001/imageCode" ref="captchaImage" alt="" style="width: 100%; height: 40px" @click="updateCaptcha">
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" style="width: 100%">注册</el-button>
        </el-form-item>
      </el-form>
      <ul class="auth_box">
        <li class="iconfont icon-QQ" style="color: skyblue"></li>
        <li class="iconfont icon-weixin" style="color: green"></li>
        <li class="iconfont icon-weibo" style="color: red"></li>
        <li class="iconfont icon-github" style="color:#000;">
<!--          <a href="http://127.0.0.1:7001/githubAuth"></a>-->
          <a href="http://127.0.0.1:7001/passport/github"></a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref } from 'vue-property-decorator'
import { ElForm } from 'element-ui/types/form'
import { loginUser, isLogin } from '@/api'

@Component({
// 如果在类中找不到需要添加的内容,name就可以写在这个地方
  name: 'Login',
  components: {}
})
export default class Login extends Vue {
  private loginData = {
    username: '',
    phone: '',
    email: '',
    password: '',
    captcha: '',
    type: 'normal'
  };

  private validateName = (rule: any, value: any, callback: any) => {
    const normalReg = /^[A-Za-z0-9]{6,}$/
    const emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    const phoneReg = /^1[3456789]\d{9}/
    if (value === '') {
      callback(new Error('请填写用户名'))
    } else if (emailReg.test(value)) {
      this.loginData.email = this.loginData.username
      // this.loginData.username = ''
      this.loginData.type = 'email'
      callback()
    } else if (phoneReg.test(value)) {
      this.loginData.phone = this.loginData.username
      // this.loginData.username = ''
      this.loginData.type = 'phone'
      callback()
    } else if (normalReg.test(value)) {
      this.loginData.type = 'normal'
      callback()
    } else {
      callback(new Error('用户名格式不正确'))
    }
  };

  private validatePassword = (rule: any, value: any, callback: any) => {
    const reg = /(?=.*([a-zA-Z].*))(?=.*[0-9].*)[a-zA-Z0-9-*/+.~!@#$%^&*()]{8,20}$/
    if (value === '') {
      callback(new Error('请填写密码'))
    } else if (value.length < 6) {
      callback(new Error('用户名应该是8-20位!'))
    } else if (!reg.test(value)) {
      callback(new Error('至少包含数字跟字母，可以有符号'))
    } else {
      callback()
    }
  };

  private validateCaptcha = (rule: any, value: any, callback: any) => {
    const reg = /^[A-Za-z0-9]{4}$/
    if (value === '') {
      callback(new Error('请填写验证码'))
    } else if (value.length < 4) {
      callback(new Error('验证码至少是4位!'))
    } else if (!reg.test(value)) {
      callback(new Error('验证码只能是字母和数字'))
    } else {
      callback()
    }
  };

  private loginRules = {
    username: [
      { validator: this.validateName, trigger: 'blur' }
    ],
    password: [
      { validator: this.validatePassword, trigger: 'blur' }
    ],
    captcha: [
      { validator: this.validateCaptcha, trigger: 'blur' }
    ]
  }

  @Ref() readonly captchaImage!: HTMLImageElement
  private updateCaptcha (): void {
    // 不符合ts规范(强类型)
    // (this.$refs.captchaImage as any).src = `http://127.0.0.1:7001/imageCode?r=${Math.random()}`
    this.captchaImage.src = `http://127.0.0.1:7001/imageCode?r=${Math.random()}`
  }

  @Ref() readonly form!: ElForm
  private onSubmit () {
    this.form.validate((flag) => {
      if (flag) {
        loginUser(this.loginData)
          .then((data: any) => {
            console.log(data)
            if (data.status === 200) {
              /*
              将jwt进行存储
              cookie: 体积不大
              sessionStorage: 不需要持久化
              localStorage: 体积较大且需要持久存储
               */
              // sessionStorage.setItem('token', data.data.token)
              this.$router.push('/admin')
            } else {
              this.updateCaptcha();
              (this as any).$message.error(data.msg)
            }
          })
          .catch((e) => {
            this.updateCaptcha();
            (this as any).$message.error(e.response.data.msg)
          })
      } else {
        (this as any).$message.error('数据格式不对')
      }
    })
  }

  private myFn () {
    isLogin()
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
.login_container{
  width: 100%;
  height: 100%;
  background: url("../assets/bg.jpg") no-repeat;
  background-size: cover;
  position: relative;
  .login_box{
    width: 600px;
    height: 430px;
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
      padding: 0 20px;
      box-sizing: border-box;
    }
    .auth_box{
      display: flex;
      list-style: none;
      padding: 0;
      justify-content: space-around;
      li{
        font-size: 30px;
        position: relative;
        a{
          position: absolute;
          left: 0;
          top: 0;
          display: block;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
