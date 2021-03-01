<template>
    <div class="">
      欢迎界面
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
// 如果在类中找不到需要添加的内容,name就可以写在这个地方
  name: 'Welcome',
  components: {}
})
export default class Welcome extends Vue {

}
</script>

<style lang="scss" scoped>

</style>
