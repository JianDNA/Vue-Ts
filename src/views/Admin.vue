<template>
  <el-container>
    <el-header>
      <div class="header-left" @click="toggleCollapse"></div>
      <div class="header-right">
        <img src="../assets/avatar.jpg"  alt="">
        <p>hzj</p>
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
          <el-submenu :index="item.menuName" v-for="item in menus" :key="item.menuName">
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{item.menuName}}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item-group>
              <el-menu-item :index="subItem.path" v-for="subItem in item.children" :key="subItem.menuName"  @click="changeDefaultActivePath(subItem.path)">
                <template slot="title">
                  <i :class="subItem.icon"></i>
                  <span>{{subItem.menuName}}</span>
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
import { getUsers } from '../api/index'
import Cookies from 'js-cookie'
@Component({
// 如果在类中找不到需要添加的内容,name就可以写在这个地方
  name: 'Admin',
  components: {}
})
export default class Admin extends Vue {
  private myFn () {
    console.log(66)
    getUsers()
      .then(data => {
        console.log(data)
      })
      .catch(e => {
        console.log(e)
      })
  }

  private defaultActivePath = ''
  private menus = [
    {
      menuName: '用户登录',
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

  created (): void {
    const path = sessionStorage.getItem('activePath')
    this.defaultActivePath = path || ''
    // console.log(this.userInfo);
  }

  private isCollapse = false;
  private toggleCollapse () {
    this.isCollapse = !this.isCollapse
  }

  private logout () {
    Cookies.remove('token')
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
