<template>
  <div class="user-list-container">
    <!-- 搜索和操作区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="searchForm.phone" placeholder="请输入手机号" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="正常" value="normal" />
            <el-option label="禁用" value="disabled" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="operation-container">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>新增用户
        </el-button>
        <el-button type="danger" :disabled="!selectedUsers.length" @click="handleBatchDelete">
          <el-icon><Delete /></el-icon>批量删除
        </el-button>
      </div>
    </el-card>

    <!-- 表格区域 -->
    <el-card class="table-card">
      <el-table
        v-loading="loading"
        :data="userList"
        @selection-change="handleSelectionChange"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="realName" label="姓名" width="120" />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column prop="role" label="角色" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'normal' ? 'success' : 'danger'">
              {{ scope.row.status === 'normal' ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="scope">
            <el-button link type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button link type="primary" @click="handleDetail(scope.row)">查看</el-button>
            <el-button 
              link 
              :type="scope.row.status === 'normal' ? 'danger' : 'success'"
              @click="handleToggleStatus(scope.row)"
            >
              {{ scope.row.status === 'normal' ? '禁用' : '启用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'

// 定义用户类型接口
interface User {
  id: number
  username: string
  realName: string
  phone: string
  email: string
  role: string
  status: string
  createTime: string
}

// 搜索表单
const searchForm = reactive({
  username: '',
  phone: '',
  status: ''
})

// 表格数据
const loading = ref(false)
const userList = ref<User[]>([]) // 明确指定类型为 User 数组
const selectedUsers = ref<User[]>([]) // 同样为选中用户指定类型
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 模拟获取用户列表数据
const getUserList = () => {
  loading.value = true
  // 模拟异步请求
  setTimeout(() => {
    const mockData: User[] = [] // 指定 mockData 的类型
    for (let i = 1; i <= 20; i++) {
      mockData.push({
        id: i,
        username: `user${i}`,
        realName: `用户${i}`,
        phone: `1381234${i.toString().padStart(4, '0')}`,
        email: `user${i}@example.com`,
        role: i % 3 === 0 ? '管理员' : '普通用户',
        status: i % 5 === 0 ? 'disabled' : 'normal',
        createTime: '2023-06-15 12:00:00'
      })
    }
    userList.value = mockData
    total.value = 100
    loading.value = false
  }, 500)
}

// 表格选择变化
const handleSelectionChange = (selection: User[]) => { // 指定参数类型
  selectedUsers.value = selection
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  getUserList()
}

// 重置搜索
const resetSearch = () => {
  searchForm.username = ''
  searchForm.phone = ''
  searchForm.status = ''
  handleSearch()
}

// 分页大小变化
const handleSizeChange = (val: number) => {
  pageSize.value = val
  getUserList()
}

// 当前页变化
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getUserList()
}

// 新增用户
const handleAdd = () => {
  ElMessage.success('点击了新增用户按钮')
}

// 编辑用户
const handleEdit = (row: User) => {
  ElMessage.success(`点击了编辑用户按钮，用户ID：${row.id}`)
}

// 查看用户详情
const handleDetail = (row: User) => {
  ElMessage.success(`点击了查看用户按钮，用户ID：${row.id}`)
}

// 切换用户状态
const handleToggleStatus = (row: User) => {
  const action = row.status === 'normal' ? '禁用' : '启用'
  ElMessageBox.confirm(`确定要${action}该用户吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    row.status = row.status === 'normal' ? 'disabled' : 'normal'
    ElMessage.success(`${action}用户成功`)
  }).catch(() => {})
}

// 批量删除
const handleBatchDelete = () => {
  if (selectedUsers.value.length === 0) {
    ElMessage.warning('请选择要删除的用户')
    return
  }
  
  ElMessageBox.confirm(`确定要删除选中的 ${selectedUsers.value.length} 个用户吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('批量删除用户成功')
    getUserList()
  }).catch(() => {})
}

onMounted(() => {
  getUserList()
})
</script>

<style scoped>
.user-list-container {
  padding: 0;
}

.search-card {
  margin-bottom: 20px;
}

.search-form {
  margin-bottom: 15px;
}

.operation-container {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
}

.operation-container .el-button {
  margin-right: 10px;
}

.table-card {
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>