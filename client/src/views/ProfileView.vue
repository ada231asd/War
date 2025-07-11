<template>
  <div class="profile-view">
    <div class="profile-card">
      <div class="user-avatar"></div>
      <h2>{{ user.login }}</h2>
      <p>{{ user.email }}</p>
      <button class="btn btn-outline" @click="logout">Выйти</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const user = ref({ login: '', email: '' })
const router = useRouter()

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? match[2] : null
}

onMounted(async () => {
  const token = getCookie('auth_token')
  if (!token) {
    router.push('/login')
    return
  }
  const res = await fetch('/api/profile', {
    headers: { 'Authorization': 'Bearer ' + token }
  })
  if (res.ok) {
    const data = await res.json()
    user.value = data.user
  } else {
    document.cookie = 'auth_token=; Max-Age=0; path=/'
    router.push('/login')
  }
})

function logout() {
  document.cookie = 'auth_token=; Max-Age=0; path=/'
  router.push('/login')
}
</script>

<style scoped lang="scss">
.profile-view {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #181c22;
}
.profile-card {
  background: #23272f;
  padding: 2.5rem 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.15);
  min-width: 320px;
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .user-avatar {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: #888;
    margin-bottom: 1.5rem;
  }
  h2 {
    color: #ffd700;
    margin-bottom: 0.5rem;
    font-family: 'War Thunder', sans-serif;
  }
  p {
    color: #fff;
    margin-bottom: 2rem;
  }
  .btn {
    width: 100%;
  }
}
</style> 