<template>
  <el-container>
    <el-header>
      <div class="header-left" @click="toggleCollapse"></div>
      <div class="header-right">
        <img :src="userInfo.baseURL + userInfo.avatarURL"  alt="">
        <p>{{userInfo.username || userInfo.emacr || userInfo.phone}}</p>
        <el-button @click.stop="logout">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '65px' : '200px'">
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#fff"
          text-color="#666"
          active-text-color="deepskyblue"
          :collapse="isCollapse"
          :router="true"
          :collapse-transition="false"
          :default-active="defaultActivePath">
          <!--一级菜单-->
          <el-submenu :index="item.rightsPath" v-for="item in currentMenus" :key="item.id">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span>{{item.rightsName}}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item-group>
              <el-menu-item :index="subItem.rightsPath" v-for="subItem in item.children" :key="subItem.id"  @click="changeDefaultActivePath(subItem.path)">
                <template slot="title">
                  <i class="el-icon-setting"></i>
                  <span>{{subItem.rightsName}}</span>
                </template>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Cookies from 'js-cookie'
@Component({
// 如果在类中找不到需要添加的内容,name就可以写在这个地方
  name: 'Admin',
  components: {}
})
export default class Admin extends Vue {
  private myFn () {
    console.log(66)
  }

  private defaultActivePath = ''
  private menus = [
    {
      menuName: '用户管理',
      path: '',
      icon: 'el-icon-setting',
      children: [
        { menuName: '用户列表', path: '/users', icon: 'el-icon-user', children: [] }
      ]
    },
    {
      menuName: '权限管理',
      path: '',
      icon: 'el-icon-collection',
      children: [
        { menuName: '角色列表', path: '/roles', icon: 'el-icon-view', children: [] },
        { menuName: '权限列表', path: '/rights', icon: 'el-icon-unlock', children: [] }
      ]
    }
  ]

  private changeDefaultActivePath (path: string): void {
    this.defaultActivePath = path
    sessionStorage.setItem('activePath', path)
  }
  private userInfo: any = {}
  private get currentMenus () {
    for (let i = 0; i < this.userInfo.rightsTree.length; i++) {
      const rights = this.userInfo.rightsTree[i]
      if (rights.rightsType === 'menu') {
        return rights.children
      }
    }
  }
  created (): void {
    const path = sessionStorage.getItem('activePath')
    this.defaultActivePath = path || ''
    // console.log(this.userInfo);
    const userInfo = sessionStorage.getItem('userInfo')
    if (userInfo) {
      this.userInfo = JSON.parse(userInfo)
    }
  }
  private isCollapse = false;
  private toggleCollapse () {
    this.isCollapse = !this.isCollapse
  }
  private logout () {
    Cookies.remove('token')
    sessionStorage.removeItem('activePath')
    sessionStorage.removeItem('userInfo')
    this.$router.push('/login')
  }
}
</script>

<style lang="scss" scoped>
.el-container{
  background: #ccc;
  width: 100%;
  height: 100%;
  .el-header{
    background: deepskyblue;
    display: flex;
    justify-content: space-between;
    .header-left{
      width: 200px;
      height: 60px;
      background: url("../assets/yaohuo.png") center center no-repeat;
      background-size: 80% auto;
    }
    .header-right{
      display: flex;
      justify-content: space-between;
      align-items: center;
      img{
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
      }
      p{
        padding-left: 10px;
        padding-right: 20px;
      }
    }
  }
  .el-aside{
    background: #fff;
  }
}
</style>
