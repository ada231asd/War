<template>
  <div class="auth-view">
    <form class="auth-form" @submit.prevent="onSubmit">
      <h2>Вход</h2>
      <div class="form-group">
        <label for="login">Логин или Email</label>
        <input type="text" id="login" v-model="loginInput" required placeholder="Введите логин или email" />
      </div>
      <div class="form-group">
        <label for="password">Пароль</label>
        <input type="password" id="password" v-model="password" required placeholder="Введите пароль" />
      </div>
      <button class="btn btn-primary" type="submit">Войти</button>
      <router-link to="/register" class="btn btn-text mt-2">Нет аккаунта? Зарегистрироваться</router-link>
      <div v-if="error" class="error-message mt-2">{{ error }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const loginInput = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

function isEmail(value) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)
}

const onSubmit = async () => {
  error.value = ''
  let payload = { password: password.value }
  if (isEmail(loginInput.value)) {
    payload.email = loginInput.value
  } else {
    payload.login = loginInput.value
  }
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!response.ok) throw new Error('Ошибка авторизации')
    const data = await response.json()
    document.cookie = `auth_token=${data.token}; path=/; max-age=2592000` // 30 дней
    router.push('/')
  } catch (e) {
    error.value = e.message || 'Ошибка авторизации'
  }
}
</script>

<style scoped lang="scss">
.auth-view {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #181c22;
}
.auth-form {
  background: #23272f;
  padding: 2.5rem 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.15);
  min-width: 320px;
  max-width: 400px;
  width: 100%;
  h2 {
    color: #ffd700;
    text-align: center;
    margin-bottom: 2rem;
    font-family: 'War Thunder', sans-serif;
  }
  .form-group {
    margin-bottom: 1.5rem;
    label {
      color: #ffd700;
      margin-bottom: 0.5rem;
      display: block;
    }
    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 4px;
      background: rgba(255,255,255,0.05);
      color: #fff;
      transition: all 0.3s;
      &::placeholder {
        color: #aaa;
      }
      &:focus {
        border-color: #ffd700;
        outline: none;
      }
    }
  }
  .btn {
    width: 100%;
    margin-bottom: 0.5rem;
  }
  .error-message {
    color: #ff4d4f;
    text-align: center;
  }
}
</style> 