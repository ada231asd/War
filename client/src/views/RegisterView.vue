<template>
  <div class="auth-view">
    <form class="auth-form" @submit.prevent="onSubmit">
      <h2>Регистрация</h2>
      <div class="form-group">
        <label for="username">Логин</label>
        <input type="text" id="username" v-model="username" required placeholder="Придумайте логин" />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required placeholder="Введите email" />
      </div>
      <div class="form-group password-group">
        <label for="password">Пароль</label>
        <div class="input-with-icon">
          <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" required placeholder="Придумайте пароль" @input="onPasswordInput" @focus="showHints = true" @blur="onPasswordBlur" />
          <button type="button" class="toggle-password" @click="showPassword = !showPassword" :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'">
            <span v-if="showPassword">👁️‍🗨️</span>
            <span v-else>👁️</span>
          </button>
        </div>
        <div v-if="showHints && password.length > 0" class="password-modal">
          <div class="password-reqs">
            <div :class="{ valid: password.length >= 8 }">Минимум 8 символов</div>
            <div :class="{ valid: /[A-Za-z]/.test(password) }">Хотя бы одна буква</div>
            <div :class="{ valid: /\d/.test(password) }">Хотя бы одна цифра</div>
          </div>
          <div class="password-strength">
            <div class="strength-bar" :style="{ width: strength + '%' }" :class="strengthClass"></div>
            <span class="strength-label">{{ strengthLabel }}</span>
          </div>
        </div>
      </div>
      <div class="form-group password-group">
        <label for="password_confirmation">Повторите пароль</label>
        <div class="input-with-icon">
          <input :type="showPasswordConfirm ? 'text' : 'password'" id="password_confirmation" v-model="password_confirmation" required placeholder="Повторите пароль" />
          <button type="button" class="toggle-password" @click="showPasswordConfirm = !showPasswordConfirm" :aria-label="showPasswordConfirm ? 'Скрыть пароль' : 'Показать пароль'">
            <span v-if="showPasswordConfirm">👁️‍🗨️</span>
            <span v-else>👁️</span>
          </button>
        </div>
      </div>
      <button class="btn btn-primary" type="submit">Зарегистрироваться</button>
      <router-link to="/login" class="btn btn-text mt-2">Уже есть аккаунт? Войти</router-link>
      <div v-if="error" class="error-message mt-2">{{ error }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const email = ref('')
const password = ref('')
const password_confirmation = ref('')
const error = ref('')
const router = useRouter()

const showPassword = ref(false)
const showPasswordConfirm = ref(false)
const showHints = ref(false)

function isPasswordStrong(pw) {
  // Минимум 8 символов, хотя бы одна буква и одна цифра, любые символы
  return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(pw)
}

const strength = ref(0)
const strengthLabel = computed(() => {
  if (strength.value < 40) return 'Слабый'
  if (strength.value < 70) return 'Средний'
  return 'Сильный'
})
const strengthClass = computed(() => {
  if (strength.value < 40) return 'weak'
  if (strength.value < 70) return 'medium'
  return 'strong'
})

function checkStrength() {
  let s = 0
  if (password.value.length >= 8) s += 40
  if (/[A-Za-z]/.test(password.value)) s += 30
  if (/\d/.test(password.value)) s += 30
  strength.value = Math.min(s, 100)
}

function onPasswordInput() {
  checkStrength()
  showHints.value = true
}
function onPasswordBlur() {
  // Задержка, чтобы можно было кликнуть по модалке
  setTimeout(() => { showHints.value = false }, 200)
}

const onSubmit = async () => {
  error.value = ''
  if (password.value !== password_confirmation.value) {
    error.value = 'Пароли не совпадают'
    return
  }
  if (!isPasswordStrong(password.value)) {
    error.value = 'Пароль должен содержать минимум 8 символов, буквы и цифры'
    return
  }
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login: username.value, email: email.value, password: password.value, password_confirmation: password_confirmation.value })
    })
    if (!response.ok) throw new Error('Ошибка регистрации')
    const data = await response.json()
    document.cookie = `auth_token=${data.token}; path=/; max-age=2592000` // 30 дней
    router.push('/')
  } catch (e) {
    error.value = e.message || 'Ошибка регистрации'
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
    .input-with-icon {
      display: flex;
      align-items: center;
      position: relative;
      input {
        width: 100%;
        padding: 0.75rem 2.5rem 0.75rem 0.75rem;
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
      .toggle-password {
        position: absolute;
        right: 0.5rem;
        background: none;
        border: none;
        color: #ffd700;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0 0.5rem;
        height: 100%;
        display: flex;
        align-items: center;
      }
    }
    .password-modal {
      position: absolute;
      left: 0;
      top: 110%;
      z-index: 10;
      background: #23272f;
      border: 1px solid #ffd700;
      border-radius: 8px;
      box-shadow: 0 2px 16px rgba(0,0,0,0.15);
      padding: 1rem 1.5rem;
      min-width: 250px;
      margin-top: 0.5rem;
      .password-reqs {
        font-size: 0.95rem;
        color: #aaa;
        .valid {
          color: #ffd700;
        }
      }
      .password-strength {
        margin-top: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        .strength-bar {
          height: 8px;
          border-radius: 4px;
          background: #ffd700;
          transition: width 0.3s;
          min-width: 40px;
          max-width: 100px;
        }
        .weak {
          background: #ff4d4f;
        }
        .medium {
          background: #ffd700;
        }
        .strong {
          background: #2ecc71;
        }
        .strength-label {
          font-size: 0.95rem;
          color: #aaa;
        }
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
.password-group {
  position: relative;
}
</style> 