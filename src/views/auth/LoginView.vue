<template>
  <!-- 登录页面容器，使用绝对定位占满整个视口 -->
  <div class="login-container">
    <!-- 登录内容卡片 -->
    <div class="login-content">
      <!-- 系统标题 -->
      <div class="login-title">客户关系管理系统</div>
      <!-- 登录表单区域 -->
      <div class="login-form">
        <!-- 登录方式切换标签页 -->
        <el-tabs v-model="activeTab" class="login-tabs" @tab-click="handleTabChange">
          <!-- 账号密码登录标签页 -->
          <el-tab-pane label="邮箱密码登录" name="email">
            <el-form
              ref="emailFormRef"
              :model="emailLoginForm"
              :rules="emailRules"
              label-position="top"
              size="large"
            >
              <!-- 邮箱输入框 -->
              <el-form-item prop="email">
                <div class="email-input-container">
                  <!-- 邮箱前缀输入框 -->
                  <el-input
                    v-model="emailPrefix"
                    placeholder="邮箱前缀"
                    clearable
                    :prefix-icon="Message"
                    maxlength="20"
                    @input="checkEmailPrefixLength"
                  />
                  <!-- 邮箱后缀选择器 -->
                  <el-select v-model="emailSuffix" class="email-suffix" @change="updateEmail">
                    <el-option label="@outlook.com" value="@outlook.com" />
                    <el-option label="@qq.com" value="@qq.com" />
                  </el-select>
                </div>
                <div v-if="emailWarning" class="input-warning">
                  <el-alert
                    title="邮箱长度已达到上限"
                    type="warning"
                    :closable="false"
                    show-icon
                    size="small"
                  />
                </div>
              </el-form-item>
              <!-- 密码输入框 -->
              <el-form-item prop="password">
                <el-input
                  v-model="emailLoginForm.password"
                  type="password"
                  placeholder="密码"
                  :prefix-icon="Lock"
                  show-password
                  maxlength="20"
                  show-word-limit
                  @input="checkInputLength('password')"
                />
                <div v-if="passwordWarning" class="input-warning">
                  <el-alert
                    title="密码长度已达到上限"
                    type="warning"
                    :closable="false"
                    show-icon
                    size="small"
                  />
                </div>
              </el-form-item>
              <!-- 记住我和忘记密码区域 -->
              <div class="remember-forgot">
                <el-checkbox v-model="emailLoginForm.remember">记住我</el-checkbox>
                <el-link type="primary" :underline="false">忘记密码?</el-link>
              </div>
              <!-- 登录按钮 -->
              <el-button
                type="primary"
                class="login-button"
                @click="handleEmailLogin(emailFormRef)"
              >
                登录
              </el-button>
            </el-form>
          </el-tab-pane>
          <!-- 手机号登录标签页 -->
          <el-tab-pane label="手机号登录" name="phone">
            <el-form ref="phoneFormRef" :model="phoneLoginForm" :rules="phoneRules" size="large">
              <!-- 手机号输入框 -->
              <el-form-item prop="phone">
                <el-input
                  v-model="phoneLoginForm.phone"
                  placeholder="手机号"
                  :prefix-icon="Iphone"
                  maxlength="11"
                  show-word-limit
                />
              </el-form-item>
              <!-- 验证码输入区域 -->
              <el-form-item prop="smsCode">
                <div class="verification-code">
                  <!-- 验证码输入框 -->
                  <el-input
                    v-model="phoneLoginForm.smsCode"
                    placeholder="验证码"
                    :prefix-icon="Key"
                    maxlength="6"
                    show-word-limit
                  />
                  <!-- 获取验证码按钮，带倒计时功能 -->
                  <el-button type="primary" :disabled="isCodeSending" @click="sendVerificationCode">
                    {{ codeButtonText }}
                  </el-button>
                </div>
              </el-form-item>
              <!-- 添加记住我选项 -->
              <div class="remember-forgot">
                <el-checkbox v-model="phoneLoginForm.remember">记住我</el-checkbox>
              </div>
              <!-- 登录按钮 -->
              <el-button
                type="primary"
                class="login-button"
                @click="handlePhoneLogin(phoneFormRef)"
              >
                登录
              </el-button>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
// 导入需要的图标组件
import { Message, Lock, Iphone, Key } from '@element-plus/icons-vue'
// 导入 API 服务，重命名避免冲突
import { loginByEmail, loginByPhone, sendVerificationCode as sendSmsCode } from '@/api/auth'
// 如果需要路由跳转，还需要导入router
// import { useRouter } from 'vue-router'
// const router = useRouter()

// ===== 验证码相关状态 =====
// 是否正在发送验证码（用于禁用按钮）
const isCodeSending = ref(false)
// 验证码按钮显示文本
const codeButtonText = ref('获取验证码')
// 倒计时秒数
const countdown = ref(60)

/**
 * 发送验证码方法
 * 点击后禁用按钮并开始倒计时
 */
const sendVerificationCode = async () => {
  try {
    console.log('开始发送验证码...')
    console.log('手机号:', phoneLoginForm.phone)

    // 先验证手机号是否有效
    await phoneFormRef.value?.validateField('phone')

    // 设置发送状态为true，禁用按钮
    isCodeSending.value = true

    console.log('发送验证码请求前...')

    // 发送获取验证码请求
    const resp = await sendSmsCode(phoneLoginForm.phone)

    // 打印返回数据，便于调试
    console.log('验证码返回数据:', JSON.stringify(resp, null, 2))
    window.alert('验证码返回数据: ' + JSON.stringify(resp))

    // 根据响应状态码处理不同情况
    if (resp.code === 200) {
      // 更新按钮文本为倒计时状态
      codeButtonText.value = `${countdown.value}秒后重试`
      // 使用API返回的具体消息
      ElMessage.success(resp.msg)

      // 如果API返回了下次重试时间，使用它来设置倒计时
      if (resp.data && resp.data.next_retry) {
        countdown.value = resp.data.next_retry
      }

      // 启动倒计时定时器
      const timer = setInterval(() => {
        // 每秒减少倒计时
        countdown.value--
        // 更新按钮文本
        codeButtonText.value = `${countdown.value}秒后重试`

        // 倒计时结束时重置状态
        if (countdown.value <= 0) {
          // 清除定时器
          clearInterval(timer)
          // 启用按钮
          isCodeSending.value = false
          // 恢复按钮文本
          codeButtonText.value = '获取验证码'
          // 重置倒计时秒数
          countdown.value = 60
        }
      }, 1000)
    } else {
      // 处理错误情况
      ElMessage.error(resp.msg || '发送验证码失败')
      isCodeSending.value = false
    }
  } catch (error) {
    // 发送失败，重置状态
    isCodeSending.value = false
    console.error('发送验证码错误:', error)
    ElMessage.error('发送验证码失败，请稍后重试')
  }
}

// ===== 邮箱输入相关 =====
// 邮箱前缀
const emailPrefix = ref('')
// 邮箱后缀
const emailSuffix = ref('@outlook.com')

// ===== 输入长度警告相关 =====
const emailWarning = ref(false)
const passwordWarning = ref(false)

/**
 * 更新完整邮箱
 */
const updateEmail = () => {
  emailLoginForm.email = emailPrefix.value + emailSuffix.value
  // 检查邮箱前缀长度
  checkEmailPrefixLength()
}

/**
 * 检查邮箱前缀长度并在达到上限时显示警告
 */
const checkEmailPrefixLength = () => {
  const prefixMaxLength = 20 // 邮箱前缀最大长度
  emailWarning.value = emailPrefix.value.length >= prefixMaxLength
}

/**
 * 检查输入长度并在达到上限时显示警告
 * @param field 字段名称
 */
const checkInputLength = (field: string) => {
  const passwordMaxLength = 20 // 最大长度为20

  if (field === 'password') {
    passwordWarning.value = emailLoginForm.password.length >= passwordMaxLength
  }
}

// ===== 邮箱密码登录相关 =====
// 邮箱密码登录表单数据对象
const emailLoginForm = reactive({
  email: '', // 邮箱
  password: '', // 密码
  remember: false, // 是否记住登录状态
})

// 表单验证规则
const emailRules = reactive<FormRules>({
  // 邮箱验证规则
  /* email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' }, // 必填验证
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }, // 邮箱格式验证
  ],
  */
  // 密码验证规则
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }, // 必填验证
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }, // 长度验证
  ],
})

// 表单引用，用于表单验证
const emailFormRef = ref<FormInstance>()

// ===== 手机号登录相关 =====
// 手机号登录表单数据对象
const phoneLoginForm = reactive({
  phone: '', // 手机号
  smsCode: '', // 验证码
  remember: false, // 添加记住登录状态选项
})

// 手机号登录表单验证规则
const phoneRules = reactive<FormRules>({
  // 手机号验证规则
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' }, // 必填验证
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }, // 手机号格式验证
  ],
  // 验证码验证规则
  smsCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' }, // 必填验证
    { min: 6, max: 6, message: '验证码长度不正确', trigger: 'blur' }, // 长度验证
  ],
})

// 手机号登录表单引用
const phoneFormRef = ref<FormInstance>()

// ===== 标签页相关 =====
// 当前激活的标签页
const activeTab = ref('email')

/**
 * 处理标签页切换
 */
const handleTabChange = () => {
  // 根据当前激活的标签页处理表单验证
  if (activeTab.value === 'email') {
    // 如果邮箱前缀为空，清除邮箱字段的验证提示
    if (!emailPrefix.value) {
      emailFormRef.value?.clearValidate('email')
    }
    // 如果密码为空，清除密码字段的验证提示
    if (!emailLoginForm.password) {
      emailFormRef.value?.clearValidate('password')
    }
  } else if (activeTab.value === 'phone') {
    // 如果手机号为空，清除手机号字段的验证提示
    if (!phoneLoginForm.phone) {
      phoneFormRef.value?.clearValidate('phone')
    }
    // 如果验证码为空，清除验证码字段的验证提示
    if (!phoneLoginForm.smsCode) {
      phoneFormRef.value?.clearValidate('smsCode')
    }
  }
}

/**
 * 邮箱密码登录方法
 * @param formEl 表单实例
 */
const handleEmailLogin = async (formEl: FormInstance | undefined) => {
  // 如果表单实例不存在则返回
  if (!formEl) return

  console.log('开始登录...')
  console.log('邮箱:', emailLoginForm.email)
  console.log('密码长度:', emailLoginForm.password.length)

  // 验证表单
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        console.log('表单验证通过，发送登录请求...')

        // 发送登录请求
        const res = await loginByEmail(emailLoginForm.email, emailLoginForm.password)

        // 打印返回数据，便于调试
        console.log('登录返回数据:', JSON.stringify(res, null, 2))
        window.alert('登录返回数据: ' + JSON.stringify(res))

        // 登录成功
        ElMessage.success('登录成功')

        // 存储token和用户信息
        const { access_token, refresh_token, user } = res
        localStorage.setItem('access_token', access_token)
        localStorage.setItem('refresh_token', refresh_token)
        localStorage.setItem('user_info', JSON.stringify(user))

        // TODO: 跳转到系统首页
        // router.push('/dashboard')
      } catch (error) {
        // 显示带有"登录失败"字样的错误消息
        console.error('登录失败:', error)
        if (error instanceof Error) {
          ElMessage.error(`登录失败: ${error.message}`)
        } else {
          ElMessage.error('登录失败，请稍后重试')
        }
      }
    } else {
      // 验证失败，输出错误信息
      console.log('表单验证失败', fields)
    }
  })
}

/**
 * 手机号登录方法
 * @param formEl 表单实例
 */
const handlePhoneLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        // 发送手机号登录请求
        const res = await loginByPhone(phoneLoginForm.phone, phoneLoginForm.smsCode)

        // 打印返回数据，便于调试
        console.log('手机登录返回数据:', res)

        // 登录成功
        ElMessage.success('登录成功')

        // 存储token和用户信息
        const { access_token, refresh_token, user } = res
        localStorage.setItem('access_token', access_token)
        localStorage.setItem('refresh_token', refresh_token)
        localStorage.setItem('user_info', JSON.stringify(user))

        // 如果选择了记住我，可以设置相关标记
        if (phoneLoginForm.remember) {
          localStorage.setItem('remember_login', 'true')
        } else {
          localStorage.removeItem('remember_login')
        }

        // TODO: 跳转到系统首页
        // router.push('/dashboard')
      } catch (error) {
        // 只记录错误，不再显示错误消息
        console.error('登录失败:', error)
      }
    } else {
      console.log('表单验证失败', fields)
    }
  })
}

// 删除这里重复声明的变量和函数
// const emailWarning = ref(false)
// const passwordWarning = ref(false)
// const checkInputLength = ...
</script>

<style scoped>
/* 登录页面容器样式 */
.login-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* 渐变背景色 */
  background: linear-gradient(135deg, #1890ff, #36cfc9);
  display: flex;
  justify-content: flex-end; /* 内容靠右对齐 */
  align-items: center;
  padding: 0 160px 0 0; /* 右侧留出160px间距 */
  box-sizing: border-box;
}

/* 登录内容卡片样式 */
.login-content {
  width: 400px;
  padding: 30px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

/* 系统标题样式 */
.login-title {
  font-size: 24px;
  text-align: center;
  margin-bottom: 30px;
  font-weight: bold;
  color: #333;
}

/* 登录表单区域样式 */
.login-form {
  margin-top: 20px;
}

/* 统一输入框样式 */
.login-form :deep(.el-input__inner) {
  /* 移除背景色设置，只保留边框颜色 */
  border-color: #dcdfe6;
  /* 增加字体大小 */
  /* font-size: 14px; */
  /* 增加字符间距 */
  letter-spacing: 1px;
}

/* 输入框聚焦时的样式 */
.login-form :deep(.el-input__inner:focus) {
  /* 移除背景色设置，只保留边框颜色 */
  border-color: #409eff;
}

/* 登录按钮样式 */
.login-button {
  width: 100%;
  height: 40px;
  margin-top: 15px; /* 增加与记住我区域的间距 */
}

/* 记住我和忘记密码区域样式 */
.remember-forgot {
  display: flex;
  justify-content: space-between; /* 两端对齐 */
  align-items: center;
  margin: 0; /* 移除所有边距 */
  padding: 0; /* 移除所有内边距 */
  height: 24px; /* 固定高度 */
}

/* 邮箱输入框容器样式 */
.email-input-container {
  display: flex;
  align-items: center;
}

/* 邮箱后缀选择器样式 */
.email-suffix {
  width: 150px;
  margin-left: 5px;
  flex-shrink: 0;
}

/* 验证码区域样式 */
.verification-code {
  display: flex;
  gap: 10px; /* 元素间间距 */
}

/* 验证码按钮样式 */
.verification-code .el-button {
  white-space: nowrap; /* 文本不换行 */
  flex-shrink: 0; /* 不缩小 */
  width: 120px; /* 固定宽度 */
}

/* 验证码输入框样式 */
.verification-code .el-input {
  flex: 1; /* 占据剩余空间 */
}

/* 标签页导航样式 */
.login-tabs :deep(.el-tabs__nav) {
  width: 100%;
  display: flex;
}

/* 标签页项目样式 */
.login-tabs :deep(.el-tabs__item) {
  flex: 1; /* 平均分配空间 */
  text-align: center;
  font-size: 15px;
  transition: all 0.3s;
  color: rgba(0, 0, 0, 0.4); /* 未选中标签透明度进一步降低 */
}

/* 增强活动标签样式 */
.login-tabs :deep(.el-tabs__item.is-active) {
  font-weight: bold;
  font-size: 16px;
  color: #1890ff;
}

/* 增强下划线样式 */
.login-tabs :deep(.el-tabs__active-bar) {
  height: 3px;
  border-radius: 3px;
  background-color: #1890ff;
}

/* 输入警告样式 */
.input-warning {
  margin-top: 5px;
  font-size: 16px;
}
.input-warning :deep(.el-alert) {
  padding: 5px 10px;
}
</style>
