<template>
    <div class="">
      <!--面包屑-->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><a href="/admin" @click="resetDefaultActivePath">首页</a></el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        <el-breadcrumb-item>活动详情</el-breadcrumb-item>
      </el-breadcrumb>

      <!--卡片内容-->
      <el-card class="box-card">
        <!--头部搜索区-->
        <el-row>
          <el-col :span="18">
            <div class="grid-content bg-purple">
              <el-form :inline="true" :model="searchData" class="demo-form-inline">
                <el-form-item label="">
                  <el-select v-model="searchData.role" placeholder="--所有角色--">
                    <el-option label="-所有角色-" value=""></el-option>
                    <el-option label="管理员" value="manger"></el-option>
                    <el-option label="普通用户" value="normal"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="">
                  <el-select v-model="searchData.origin" placeholder="--所有来源--">
                    <el-option label="-所有来源-" value=""></el-option>
                    <el-option label="本地注册" value="local"></el-option>
                    <el-option label="Github登录" value="github"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="">
                  <el-select v-model="searchData.type" placeholder="--所有用户--">
                    <el-option label="所有用户" value=""></el-option>
                    <el-option label="用户名" value="username"></el-option>
                    <el-option label="邮箱" value="email"></el-option>
                    <el-option label="手机" value="phone"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="">
                  <el-input v-model="searchData.key" placeholder="关键字"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmit">查询</el-button>
                  <el-button type="primary" @click="exportUsers">导出搜索结果</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="showAddUserDialog">添加用户</el-button>
            <el-upload
              class="excel-upload"
              action="http://127.0.0.1:7001/api/v1/importUser"
              :on-success="handleExcelSuccess"
              :before-upload="beforeExcelUpload"
              :show-file-list="false"
              :accept="'.xls'">
              <el-button type="primary" >导入用户</el-button>
            </el-upload>
            <a href="http://127.0.0.1:7001/api/v1/exportUser" style="margin-left: 20px">
              <el-button type="primary" >导出所有用户</el-button>
            </a>
          </el-col>
        </el-row>
        <!--中间的表格区域-->
        <el-table
          :data="tableData"
          :border="true"
          :stripe="true"
          style="width: 100%">
          <el-table-column type="index"></el-table-column>
          <el-table-column
            prop="username"
            label="姓名">
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="电话">
          </el-table-column>
          <el-table-column
            :formatter="getCurrentRoleName"
            label="角色">
          </el-table-column>
          <el-table-column
            label="状态">
            <template slot-scope="scope">
              <!--            {{ scope.row.userState }}-->
              <el-switch
                v-model="scope.row.userState"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="changeUserState(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" @click.stop="showEditUserDialog(scope.row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" @click="destroyUser(scope.row.id)"></el-button>
              <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" @click="showAddRoleDialog(scope.row)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!--底部分页-->
      <el-pagination
        :current-page="searchData.currentPage"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="searchData.pageSize"
        :total="totalCount"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
      </el-pagination>

      <!--添加用户对话框-->
      <el-dialog
        title="添加用户"
        :visible.sync="addUserDialogVisible"
        @close="closeAddUserDialog"
        width="30%">
        <el-form ref="addForm" :model="userData" :rules="addUserRules" label-width="0px">
          <el-form-item prop="username">
            <el-input v-model="userData.username" prefix-icon="el-icon-user"></el-input>
          </el-form-item>
          <el-form-item prop="email">
            <el-input v-model="userData.email" prefix-icon="el-icon-message"></el-input>
          </el-form-item>
          <el-form-item prop="phone">
            <el-input v-model="userData.phone" prefix-icon="el-icon-phone-outline"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="userData.password" prefix-icon="el-icon-lock"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addUserDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="createUser">确 定</el-button>
      </span>
      </el-dialog>

      <!--编辑用户对话框-->
      <el-dialog
        title="编辑用户"
        :visible.sync="editUserDialogVisible"
        @close="closeAddUserDialog"
        width="30%">
        <el-form ref="editForm" :model="editData" :rules="editUserRules" label-width="0px">
          <el-form-item style="text-align: center">
            <el-upload
              class="avatar-uploader"
              action="http://127.0.0.1:7001/api/v1/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :accept="'.jpg'">
              <img v-if="editData.avatarURL" :src="editData.baseURL + editData.avatarURL" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item prop="username">
            <el-input v-model="editData.username" prefix-icon="el-icon-user"></el-input>
          </el-form-item>
          <el-form-item prop="email">
            <el-input v-model="editData.email" prefix-icon="el-icon-message"></el-input>
          </el-form-item>
          <el-form-item prop="phone">
            <el-input v-model="editData.phone" prefix-icon="el-icon-phone-outline"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="editData.password" prefix-icon="el-icon-lock"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="editUserDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
      </el-dialog>

      <!--分配角色对话框-->
      <el-dialog
        title="分配角色"
        :visible.sync="addRoleDialogVisible"
        width="30%"
        >
        <el-form ref="form" :model="currentUser" label-width="80px">
          <el-form-item label="当前用户">
            <el-input v-model="currentUser.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="当前角色">
            <el-input v-model="currentRoleName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="新的角色">
            <el-select v-model="currentRoleId" placeholder="请选择角色">
              <el-option
                v-for="item in roles"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="addRoleDialogVisible = false">取 消</el-button>
<!--    <el-button type="primary" @click="addRole(currentUser.id)">确 定</el-button>-->
    <el-button type="primary" @click="addRole(currentUser.id)">新增角色</el-button>
    <el-button type="danger" @click="removeRole(currentUser.id)">删除角色</el-button>
  </span>
      </el-dialog>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Ref } from 'vue-property-decorator'
import { ElForm } from 'element-ui/types/form'
import { getUsers, createUsers, deleteUsers, updateUsers, getRoles, createUserRole, destroyUserRole } from '../api/index'
import XLSX from 'xlsx'
import { saveAs } from 'file-saver'
@Component({
// 如果在类中找不到需要添加的内容,name就可以写在这个地方
  name: 'Users',
  components: {}
})
export default class Users extends Vue {
  private resetDefaultActivePath () {
    sessionStorage.removeItem('activePath')
  }

  private tableData: any[] = []

  private searchData = {
    currentPage: 1,
    role: '',
    origin: '',
    type: '',
    key: '',
    pageSize: 5
  }

  private totalCount = 0
  // 分页相关
  private getUserList () {
    getUsers(this.searchData)
      .then((response: any) => {
        // console.log(response.status, response.data)
        this.tableData = response.data.data.users
        this.totalCount = response.data.data.totalCount
      })
      .catch(error => {
        (this as any).$message.error(error.response.data.msg)
      })
  }

  created (): void{
    this.getUserList()
  }

  private handleCurrentChange (currentPage: any) {
    // console.log(currentPage)
    this.searchData.currentPage = currentPage
    this.getUserList()
  }

  private handleSizeChange (currentSize: any) {
    // console.log(currentSize)
    this.searchData.pageSize = currentSize
    this.getUserList()
  }

  // 校验规则相关
  private validateName = (rule: any, value: any, callback: any) => {
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

  private validateEmail = (rule: any, value: any, callback: any) => {
    const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    if (value && !reg.test(value)) {
      callback(new Error('邮箱格式不正确'))
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

  private validatePassword2 = (rule: any, value: any, callback: any) => {
    const reg = /(?=.*([a-zA-Z].*))(?=.*[0-9].*)[a-zA-Z0-9-*/+.~!@#$%^&*()]{8,20}$/
    if (value) {
      if (value.length < 8) {
        callback(new Error('密码名应该是8-20位!'))
      } else if (!reg.test(value)) {
        callback(new Error('至少包含数字跟字母，可以有符号'))
      }
    } else {
      callback()
    }
  };

  private validatePhone = (rule: any, value: any, callback: any) => {
    const reg = /^1[3456789]\d{9}/
    if (value && !reg.test(value)) {
      callback(new Error('手机格式不正确'))
    } else {
      callback()
    }
  };

  // 查询用户
  private onSubmit () {
    this.searchData.currentPage = 1
    this.getUserList()
  }

  private exportUsers () {
    const user = this.tableData.length ? this.tableData[0] : null
    // console.log(user, '-------');
    const data: any[] = []
    if (user) {
      const cloumTitles = Object.keys(user)
      data.push(cloumTitles)
      this.tableData.forEach(user => {
        const temp: any[] = []
        cloumTitles.forEach(key => {
          temp.push(user[key])
        })
        data.push(temp)
      })
      // console.log(data)
      // 1.根据二维数组生成表格数据
      const sheet = XLSX.utils.aoa_to_sheet(data)
      // console.log(sheet)
      // 2.创建一个新的表格
      const workbook = XLSX.utils.book_new()
      // 3.把数据添加到表格中并给表格起一个名称
      XLSX.utils.book_append_sheet(workbook, sheet, 'users')
      // 4.将生成好的表格保存到本地
      // XLSX.writeFile(workbook, 'users.xls')    // 有兼容问题
      /* bookType can be any supported output type */
      const wopts: any = { bookType: 'xlsx', bookSST: false, type: 'array' }

      const wbout = XLSX.write(workbook, wopts)

      /* the saveAs call downloads a file on the local machine */
      saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'users.xlsx')
    }
  }

  // 添加用户相关
  private addUserRules = {
    username: [
      { validator: this.validateName, trigger: 'blur' }
    ],
    password: [
      { validator: this.validatePassword, trigger: 'blur' }
    ],
    email: [
      { validator: this.validateEmail, trigger: 'blur' }
    ],
    phone: [
      { validator: this.validatePhone, trigger: 'blur' }
    ]
  }

  private userData = {
    username: '',
    email: '',
    phone: '',
    password: ''
  }

  private addUserDialogVisible = false
  @Ref() readonly addForm?: ElForm
  private showAddUserDialog () {
    this.addUserDialogVisible = true
    this.addForm && this.addForm.resetFields()
  }

  private createUser () {
    this.addUserDialogVisible = false
    // eslint-disable-next-line
    this.addForm!.validate((flag) => {
      if (flag) {
        createUsers(this.userData)
          .then((response: any) => {
            if (response.status === 200) {
              const user = response.data.data
              this.tableData.push(user);
              (this as any).$message.success('添加用户成功')
            } else {
              (this as any).$message.error(response.data.msg)
            }
          })
          .catch((error) => {
            (this as any).$message.error(error.response.data.msg)
          })
      } else {
        (this as any).$message.error('数据格式不对')
      }
    })
  }

  private closeAddUserDialog () {
    console.log(66)
  }

  // 删除用户相关
  private destroyUser (id: string) {
    deleteUsers(id)
      .then((response: any) => {
        if (response.status === 200) {
          const idx = this.tableData.findIndex((obj) => {
            return obj.id === id
          })
          this.tableData.splice(idx, 1);
          (this as any).$message.success('删除用户成功')
        } else {
          (this as any).$message.error(response.data.msg)
        }
      })
      .catch((error) => {
        (this as any).$message.error(error.response.data.msg)
      })
  }

  // 编辑用户相关
  private editUserRules = {
    username: [
      { validator: this.validateName, trigger: 'blur' }
    ],
    password: [
      { validator: this.validatePassword2, trigger: 'blur' }
    ],
    email: [
      { validator: this.validateEmail, trigger: 'blur' }
    ],
    phone: [
      { validator: this.validatePhone, trigger: 'blur' }
    ]
  }

  private editData = {
    id: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    avatarURL: '',
    baseURL: ''
  }

  private editUserDialogVisible = false
  @Ref() readonly editForm?: ElForm
  private editUser () {
    this.editUserDialogVisible = false
    // eslint-disable-next-line
    this.editForm!.validate((flag) => {
      if (flag) {
        updateUsers(this.editData.id, this.editData)
          .then((response: any) => {
            if (response.status === 200) {
              const idx = this.tableData.findIndex(item => {
                return item.id === this.editData.id
              })
              // this.tableData[idx] = this.editData;
              this.$set(this.tableData, idx, this.editData);
              (this as any).$message.success('更新用户成功')
            } else {
              (this as any).$message.error(response.data.msg)
            }
          })
          .catch((error) => {
            (this as any).$message.error(error.response.data.msg[0].message)
          })
      } else {
        (this as any).$message.error('数据格式不对')
      }
    })
  }

  private showEditUserDialog (row: any) {
    Object.assign(this.editData, row)
    this.editUserDialogVisible = true
  }

  // 修改用户状态相关
  private changeUserState (user: {id: string; userState: boolean}) {
    console.log(user)
    updateUsers(user.id, user)
      .then((response: any) => {
        if (response.status === 200) {
          (this as any).$message.success('更新用户状态成功')
        } else {
          user.userState = !user.userState;
          (this as any).$message.error('更新用户状态失败')
        }
      })
      .catch(() => {
        user.userState = !user.userState;
        (this as any).$message.error('更新用户状态失败')
      })
  }

  // 上传用户头像相关
  // 上传成功之后
  /**
   *
   * @param res   服务器返回数据
   * @param file  上传成功后返回的文件对象
   * @private
   */
  private handleAvatarSuccess (res: any) {
    console.log(res)
    if (res.code === 200) {
      this.editData.avatarURL = res.data
    }
  }

  // 上传之前
  private beforeAvatarUpload (file: any) {
    const isJPG = file.type === 'image/jpeg'
    const isLt2M = file.size / 1024 / 1024 < 2

    if (!isJPG) {
      (this as any).$message.error('上传头像图片只能是 JPG 格式!')
    }
    if (!isLt2M) {
      (this as any).$message.error('上传头像图片大小不能超过 2MB!')
    }
    return isJPG && isLt2M
  }

  // 上传excel相关代码
  // 上传成功之后
  private handleExcelSuccess (res: any) {
    console.log(res)
    if (res.code === 200) {
      this.editData.avatarURL = res.data
    }
  }

  // 上传之前
  private beforeExcelUpload (file: any) {
    console.log(file.size)
    const isExcel = file.type === 'application/vnd.ms-excel'
    const isLt2M = file.size / 1024 / 1024 < 2

    if (!isExcel) {
      (this as any).$message.error('只能上传.xls格式的 Excel 文件!')
    }
    if (!isLt2M) {
      (this as any).$message.error('上传头像图片大小不能超过 2MB!')
    }
    return isExcel && isLt2M
  }

  // 分配角色相关
  private addRoleDialogVisible = false

  private currentUser = {};
  private roles = [];
  private currentRoleId = '';
  private showAddRoleDialog (user: any) {
    this.addRoleDialogVisible = true
    this.currentUser = user
    // console.log(user)
    getRoles({})
      .then((response: any) => {
        if (response.status === 200) {
          console.log(response.data.data)
          this.roles = response.data.data;
          (this as any).$message.success('获取角色信息成功')
        } else {
          (this as any).$message.error('获取角色信息失败')
        }
      })
      .catch(() => {
        (this as any).$message.error('获取角色信息失败')
      })
  }

  private addRole (userId: string) {
    this.addRoleDialogVisible = false
    const obj = { userId: userId, roleId: this.currentRoleId }
    createUserRole(obj)
      .then((response: any) => {
        if (response.status === 200) {
          // 分配成功后,重新获取角色,更新界面
          this.getUserList();
          (this as any).$message.success('分配角色成功')
        } else {
          (this as any).$message.error('分配角色失败')
        }
      })
      .catch(() => {
        (this as any).$message.error('分配角色失败')
      })
  }

  private removeRole (userId: string) {
    this.addRoleDialogVisible = false
    const obj = { userId: userId, roleId: this.currentRoleId }
    destroyUserRole(userId, obj)
      .then((response: any) => {
        if (response.status === 200) {
          this.getUserList();
          (this as any).$message.success('移出角色成功')
        } else {
          (this as any).$message.error('移出角色失败')
        }
      })
      .catch(() => {
        (this as any).$message.error('移出角色失败')
      })
  }

  private getCurrentRoleName (user: any) {
    const roles = user.roles
    const names: any[] = []
    roles.forEach((role: any) => {
      names.push(role.roleName)
    })
    return names.join(' | ')
  }

  private get currentRoleName () {
    if (JSON.stringify(this.currentUser) === '{}') return ''
    return this.getCurrentRoleName(this.currentUser)
  }
}
</script>

<style lang="scss" scoped>
.el-breadcrumb{
  padding-bottom: 20px;
}
.el-pagination{
  padding-top: 20px;
}
.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: inline-block;
}
.avatar-uploader:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.excel-upload{
  display: inline-block;
  margin-left: 20px;
}
</style>
