<template>
  <main class="auth-layout">
    <section class="brand-panel"><div class="brand-mark">JM</div><p class="eyebrow">JM ELECTRON</p><h1>创建账号，开始使用</h1><p class="brand-copy">注册完成后将自动进入你的主页。</p></section>
    <el-card class="auth-card" shadow="never">
      <div class="auth-heading"><h2>创建新账号</h2><p>填写信息，创建你的账号。</p></div>
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent="submit">
        <el-form-item label="用户名" prop="username"><el-input v-model="form.username" placeholder="请输入用户名" size="large" autocomplete="username" /></el-form-item>
        <el-form-item label="密码" prop="password"><el-input v-model="form.password" type="password" placeholder="至少 6 个字符" size="large" show-password autocomplete="new-password" /></el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword"><el-input v-model="form.confirmPassword" type="password" placeholder="请再次输入密码" size="large" show-password autocomplete="new-password" /></el-form-item>
        <el-button class="submit-button" type="primary" size="large" native-type="submit">注册并进入主页</el-button>
      </el-form>
      <p class="auth-switch">已有账号？<router-link to="/login">返回登录</router-link></p>
    </el-card>
  </main>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const formRef = ref<FormInstance>()
const form = reactive({ username: '', password: '', confirmPassword: '' })
const rules: FormRules<typeof form> = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }, { min: 3, max: 24, message: '用户名长度为 3 到 24 个字符', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, message: '密码至少需要 6 个字符', trigger: 'blur' }],
  confirmPassword: [{ validator: (_rule, value, callback) => value === form.password ? callback() : callback(new Error('两次输入的密码不一致')), trigger: 'blur' }]
}
const submit = async (): Promise<void> => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  authStore.login(form.username)
  ElMessage.success('注册成功，欢迎使用！')
  await router.push({ name: 'home' })
}
</script>
