<template>
  <header class="the-header">
    <div class="header-container">
      <div class="logo">
        <router-link to="/">
          <img src="../assets/images/logo.png" alt="ThunderCraft" class="logo-image">
          <span class="logo-text">ThunderCraft</span>
        </router-link>
      </div>

      <nav class="main-nav" :class="{ 'is-open': isMenuOpen }">
        <router-link to="/sight-editor" class="nav-link">Редактор прицелов</router-link>
        <router-link to="/skin-editor" class="nav-link">Редактор скинов</router-link>
        <router-link to="/library" class="nav-link">Библиотека</router-link>
        <router-link to="/community" class="nav-link">Сообщество</router-link>
        <router-link to="/blog" class="nav-link">Блог</router-link>
      </nav>

      <!-- <div class="auth-buttons">
        <button class="auth-btn steam">
          <img src="../assets/images/steam-icon.svg" alt="Steam">
          Войти через Steam
        </button>
        <button class="auth-btn vk">
          <img src="../assets/images/vk-icon.svg" alt="VK">
          Войти через VK
        </button>
        <button class="auth-btn discord">
          <img src="../assets/images/discord-icon.svg" alt="Discord">
          Войти через Discord
        </button>
      </div> -->

      <button class="menu-toggle" @click="toggleMenu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<style lang="scss">
.the-header {
  background: rgba(202, 213, 220, 0.95);
  backdrop-filter: blur(10px);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  border-bottom: 1.5px solid #5BB9B2;
  box-shadow: 0 2px 8px rgba(90,109,118,0.2);

  .header-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo {
    a {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: #4B9FAF;
    }

    .logo-image {
      height: 40px;
      margin-right: 0.5rem;
    }

    .logo-text {
      font-family: 'War Thunder', sans-serif;
      font-size: 1.5rem;
      text-transform: uppercase;
      color: #4B9FAF;
      background: none;
      -webkit-text-fill-color: initial;
    }
  }

  .main-nav {
    display: flex;
    gap: 2rem;

    .nav-link {
      color: #5A6D76;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s;

      &:hover {
        color: #5BB9B2;
      }

      &.router-link-active {
        color: #5BB9B2;
      }
    }
  }

  .auth-buttons {
    display: flex;
    gap: 1rem;

    .auth-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;

      img {
        width: 20px;
        height: 20px;
      }

      &.steam {
        background: #171a21;
        color: #fff;
      }

      &.vk {
        background: #4c75a3;
        color: #fff;
      }

      &.discord {
        background: #7289da;
        color: #fff;
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
    }
  }

  .menu-toggle {
    display: none;
    flex-direction: column;
    gap: 6px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;

    span {
      display: block;
      width: 25px;
      height: 2px;
      background: #4B9FAF;
      transition: all 0.3s;
    }
  }
}

@media (max-width: 1024px) {
  .the-header {
    .main-nav {
      gap: 1rem;
    }

    .auth-buttons {
      .auth-btn {
        span {
          display: none;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .the-header {
    .main-nav {
      position: fixed;
      top: 70px;
      left: 0;
      right: 0;
      background: #CAD5DC;
      flex-direction: column;
      gap: 1.5rem;
      padding: 2rem 0;
      z-index: 1001;
      box-shadow: 0 2px 8px rgba(90,109,118,0.2);
    }

    .auth-buttons {
      display: none;
    }

    .menu-toggle {
      display: flex;

      &.is-open {
        span {
          &:first-child {
            transform: translateY(8px) rotate(45deg);
          }

          &:nth-child(2) {
            opacity: 0;
          }

          &:last-child {
            transform: translateY(-8px) rotate(-45deg);
          }
        }
      }
    }
  }
}
</style> 