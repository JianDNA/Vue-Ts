<template>
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
          <img src="http://127.0.0.1:7001/imageCode" ref="captchaImage" alt="" style="width: 100%; height: 40px" @click="updateCaptcha">
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
</template>

<script lang="ts">
import { Vue, Component, Ref } from 'vue-property-decorator'
import { ElForm } from 'element-ui/types/form'

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

  onSubmit () {
    console.log(66)
  }

  @Ref() readonly captchaImage!: HTMLImageElement
  private updateCaptcha (): void {
    // 不符合ts规范(强类型)
    // (this.$refs.captchaImage as any).src = `http://127.0.0.1:7001/imageCode?r=${Math.random()}`
    this.captchaImage.src = `http://127.0.0.1:7001/imageCode?r=${Math.random()}`
  }
}
</script>

<style lang="sass" scoped>

</style>
