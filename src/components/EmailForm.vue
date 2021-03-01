<template>
  <!--  添加校验规则 1. 为表单指定规则-->
  <el-form ref="form" :model="registerData" :rules="registerRules" label-width="0px">
    <!--  添加校验规则 2. 为表单项指定prop-->
    <el-form-item label="" prop="username">
      <el-input prefix-icon="el-icon-user" v-model="registerData.email"></el-input>
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
          <el-button @click="sendEmailCode">发送邮件</el-button>
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
import { registerUser, sendCode2Email } from '../api/index'

@Component({
// 如果在类中找不到需要添加的内容,name就可以写在这个地方
  name: 'NormalForm',
  components: {}
})
export default class NormalForm extends Vue {
  private registerData = {
    email: '',
    password: '',
    captcha: '',
    type: 'email',
    checked: true
  };

  private validateEmail = (rule: any, value: any, callback: any) => {
    // 给回调传error就是不通过
    const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    if (value === '') {
      callback(new Error('请填写用户邮箱'))
    } else if (!reg.test(value)) {
      callback(new Error('邮箱格式不正确!'))
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
      { validator: this.validateEmail, trigger: 'blur' }
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

  private sendEmailCode () {
    sendCode2Email({ email: this.registerData.email })
      .then((data: any) => {
        console.log(data)
        if (data.code === 200) {
          (this as any).$message.success('验证码已发送')
        } else {
          (this as any).$message.error(data.msg)
        }
      })
      .catch(e => {
        (this as any).$message.error(e.message)
      })
  }

  @Ref() readonly form!: ElForm
  private onSubmit () {
    this.form.validate((flag) => {
      if (flag) {
        registerUser(this.registerData)
          .then((data: any) => {
            console.log(data)
            if (data.code === 200) {
              this.$router.push('/login')
            } else {
              (this as any).$message.error(data.msg[0].message)
            }
          })
          .catch((e) => {
            (this as any).$message.error(e.message)
          })
      } else {
        (this as any).$message.error('数据格式不对')
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
