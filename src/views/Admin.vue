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
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#fff"
          text-color="#666"
          active-text-color="deepskyblue"
          :collapse="isCollapse"
          :router="true"
          :collapse-transition="false">
          <!--一级菜单-->
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span>用户管理</span>
            </template>
            <!--二级菜单-->
            <el-menu-item-group>
              <el-menu-item>
                <el-menu-item index="/users">
                  <template slot="title">
                    <i class="el-icon-user"></i>
                    <span>用户列表</span>
                  </template>
                </el-menu-item>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-collection"></i>
              <span>权限管理</span>
            </template>
            <!--二级菜单-->
            <el-menu-item-group>
              <el-menu-item>
                <el-menu-item index="/roles">
                  <template slot="title">
                    <i class="el-icon-view"></i>
                    <span>角色列表</span>
                  </template>
                </el-menu-item>
              </el-menu-item>

              <el-menu-item>
                <el-menu-item index="/rights">
                  <template slot="title">
                    <i class="el-icon-unlock"></i>
                    <span>权限列表</span>
                  </template>
                </el-menu-item>
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
    .el-submenu{
      li{
        padding: 0;
        ul{
          >.el-menu-item{
            padding-left: 0 !important;
          }
        }
      }
    }
  }
}
</style>
