<template>
  <!--  添加校验规则 1. 为表单指定规则-->
  <el-form ref="form" :model="registerData" :rules="registerRules" label-width="0px">
    <!--  添加校验规则 2. 为表单项指定prop-->
    <el-form-item label="" prop="username">
      <el-input prefix-icon="el-icon-phone-outline" v-model="registerData.phone"></el-input>
    </el-form-item>
    <el-form-item label="" prop="password">
      <el-input prefix-icon="el-icon-lock" type="password" v-model="registerData.password"></el-input>
    </el-form-item>
    <el-form-item label="" prop="captcha">
      <el-row>
        <el-col :span="18">
          <el-input prefix-icon="el-icon-lock" v-model="registerData.captcha"></el-input>
        </el-col>
        <el-col :span="6">
          <el-button @click="sendPhoneCode">发送验证码</el-button>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit" style="width: 100%">注册</el-button>
    </el-form-item>
    <el-form-item prop="checked">
      <el-checkbox v-model="registerData.checked">
        <p>阅读并接受
          <a href="javascript:;">《xxx用户协议》</a>
          及
          <a href="javascript:;">《xxx隐私权保护申明》</a>
        </p>
      </el-checkbox>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Vue, Component, Ref } from 'vue-property-decorator'
import { ElForm } from 'element-ui/types/form'
import { registerUser, sendCode2Phone } from '../api/index'

@Component({
// 如果在类中找不到需要添加的内容,name就可以写在这个地方
  name: 'NormalForm',
  components: {}
})
export default class NormalForm extends Vue {
  private registerData = {
    phone: '',
    password: '',
    captcha: '',
    registerType: 'phone',
    checked: true
  };

  private validatePhone = (rule: any, value: any, callback: any) => {
    // 给回调传error就是不通过
    const reg = /^1[3456789]\d{9}$/
    if (value === '') {
      callback(new Error('请填写用户手机'))
    } else if (!reg.test(value)) {
      callback(new Error('手机格式不正确!'))
    } else {
      callback()
    }
  };

  private validatePassword = (rule: any, value: any, callback: any) => {
    const reg = /(?=.*([a-zA-Z].*))(?=.*[0-9].*)[a-zA-Z0-9-*/+.~!@#$%^&*()]{8,20}$/
    if (value === '') {
      callback(new Error('请填写密码'))
    } else if (value.length < 8) {
      callback(new Error('密码名应该是8-20位!'))
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

  private validateChecked = (rule: any, value: any, callback: any) => {
    if (!value) {
      callback(new Error('请阅读用并同意户协议'))
    } else {
      callback()
    }
  };

  private registerRules = {
    email: [
      { validator: this.validatePhone, trigger: 'blur' }
    ],
    password: [
      { validator: this.validatePassword, trigger: 'blur' }
    ],
    captcha: [
      { validator: this.validateCaptcha, trigger: 'blur' }
    ],
    checked: [
      { validator: this.validateChecked, trigger: 'change' }
    ]

  }

  private sendPhoneCode () {
    sendCode2Phone({ phone: this.registerData.phone })
      .then((data: any) => {
        console.log(data)
        if (data.code === 200) {
          this.$message('验证码已发送')
        } else {
          this.$message.error(data.msg)
        }
      })
      .catch(e => {
        this.$message.error(e.message)
      })
  }

  @Ref() readonly form!: ElForm
  private onSubmit () {
    this.form.validate((flag) => {
      if (flag) {
        registerUser(this.registerData)
          .then((data) => {
            console.log(data)
            if (data.code === 200) {
              this.$router.push('/login')
            } else {
              this.$message.error(data.msg)
            }
          })
          .catch((e) => {
            this.$message.error(e.message)
          })
      } else {
        this.$message.error('数据格式不对')
      }
    })
  }

  public resetForm () {
    this.form.resetFields()
  }
}
</script>

<style lang="sass" scoped>

</style>
