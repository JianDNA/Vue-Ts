<template>
  <!--  添加校验规则 1. 为表单指定规则-->
  <el-form ref="form" :model="registerData" :rules="registerRules" label-width="0px">
    <!--  添加校验规则 2. 为表单项指定prop-->
    <el-form-item label="" prop="username">
      <el-input prefix-icon="el-icon-user" v-model="registerData.username"></el-input>
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
          <img src="http://127.0.0.1:7001/imageCode" ref="captchaImage" alt="" style="width: 100%; height: 40px" @click="updateCaptcha">
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
import { registerUser } from '../api/index'

@Component({
// 如果在类中找不到需要添加的内容,name就可以写在这个地方
  name: 'NormalForm',
  components: {}
})
export default class NormalForm extends Vue {
  private registerData = {
    username: '',
    password: '',
    captcha: '',
    type: 'normal',
    checked: true
  };

  private validateName = (rule: any, value: any, callback: any) => {
    // 给回调传error就是不通过
    const reg = /^[A-Za-z0-9]{6,}$/
    if (value === '') {
      callback(new Error('请填写用户名'))
    } else if (value.length < 6) {
      callback(new Error('用户名至少是6位!'))
    } else if (!reg.test(value)) {
      callback(new Error('用户名只能是字母和数字'))
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
    username: [
      { validator: this.validateName, trigger: 'blur' }
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

  @Ref() readonly form!: ElForm
  private onSubmit () {
    this.form.validate((flag) => {
      if (flag) {
        registerUser(this.registerData)
          .then((data) => {
            console.log(data)
            if (data.status === 200) {
              this.$router.push('/login')
            } else {
              this.$message.error(data.msg)
            }
          })
          .catch((e) => {
            this.updateCaptcha()
            this.$message.error(e.message)
          })
      } else {
        this.$message.error('数据格式不对')
      }
    })
  }

  @Ref() readonly captchaImage!: HTMLImageElement
  private updateCaptcha (): void {
    // 不符合ts规范(强类型)
    // (this.$refs.captchaImage as any).src = `http://127.0.0.1:7001/imageCode?r=${Math.random()}`
    this.captchaImage.src = `http://127.0.0.1:7001/imageCode?r=${Math.random()}`
  }

  public resetForm () {
    this.form.resetFields()
  }
}
</script>

<style lang="sass" scoped>

</style>
