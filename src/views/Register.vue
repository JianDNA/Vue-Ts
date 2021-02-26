<template>
    <div class="register_container">
      <div class="register_box">
        <h1>欢迎注册</h1>
        <el-tabs :tab-position="'left'" :stretch="true" style="height: 350px" @tab-click="handleClick">
          <el-tab-pane label="普通注册">
            <NormalForm ref="normalForm"/>
          </el-tab-pane>
          <el-tab-pane label="邮箱注册">
            <EmailForm ref="emailForm"/>
          </el-tab-pane>
          <el-tab-pane  label="手机注册">
            <PhoneForm ref="phoneForm"/>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Ref } from 'vue-property-decorator'
import NormalForm from '@/components/NormalForm.vue'
import EmailForm from '@/components/EmailForm.vue'
import PhoneForm from '@/components/PhoneForm.vue'

@Component({
// 如果在类中找不到需要添加的内容,name就可以写在这个地方
  name: 'Register',
  components: {
    NormalForm,
    EmailForm,
    PhoneForm
  }
})
export default class Register extends Vue {
  @Ref() readonly normalForm!: NormalForm
  @Ref() readonly emailForm!: NormalForm
  @Ref() readonly phoneForm!: NormalForm
  private handleClick () {
    this.normalForm.resetForm()
    this.emailForm.resetForm()
    this.phoneForm.resetForm()
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
      padding-right: 20px;
      box-sizing: border-box;
    }
  }
}
</style>
