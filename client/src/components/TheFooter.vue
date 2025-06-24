<template>
  <footer class="the-footer">
    <div class="footer-container">
      <div class="footer-main">
        <div class="footer-brand">
          <img src="../assets/images/logo.png" alt="ThunderCraft" class="footer-logo">
          <p class="footer-description">
            Сообщество разработчиков и энтузиастов War Thunder, создающих уникальные прицелы и скины
          </p>
        </div>

        <div class="footer-links">
          <div class="footer-section">
            <h3>Навигация</h3>
            <router-link to="/sight-editor">Редактор прицелов</router-link>
            <router-link to="/skin-editor">Редактор скинов</router-link>
            <router-link to="/library">Библиотека</router-link>
            <router-link to="/community">Сообщество</router-link>
            <router-link to="/blog">Блог</router-link>
          </div>

          <div class="footer-section">
            <h3>Сообщество</h3>
            <a href="#" class="social-link">
              <img src="../assets/images/discord-icon.svg" alt="Discord">
              Discord
            </a>
            <a href="#" class="social-link">
              <img src="../assets/images/vk-icon.svg" alt="VK">
              VK
            </a>
            <a href="#" class="social-link">
              <img src="../assets/images/reddit-icon.svg" alt="Reddit">
              Reddit
            </a>
            <a href="#" class="social-link">
              <img src="../assets/images/youtube-icon.svg" alt="YouTube">
              YouTube
            </a>
          </div>

          <div class="footer-section">
            <h3>Поддержка</h3>
            <router-link to="/faq">FAQ</router-link>
            <router-link to="/contact">Контакты</router-link>
            <router-link to="/privacy">Политика конфиденциальности</router-link>
            <router-link to="/terms">Условия использования</router-link>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2024 ThunderCraft. Все права защищены.</p>
        <p>War Thunder является зарегистрированным товарным знаком Gaijin Entertainment.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const selectedLang = ref('ru')

const handleSubscribe = () => {
  // Логика подписки на рассылку
  console.log('Subscribe:', email.value)
  email.value = ''
}
</script>

<style lang="scss">
.the-footer {
  background: #1a1a1a;
  color: #fff;
  padding: 4rem 0 2rem;

  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .footer-main {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 4rem;
    margin-bottom: 3rem;
  }

  .footer-brand {
    .footer-logo {
      height: 50px;
      margin-bottom: 1rem;
    }

    .footer-description {
      color: #999;
      line-height: 1.6;
    }
  }

  .footer-links {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }

  .footer-section {
    h3 {
      color: #ffd700;
      margin-bottom: 1.5rem;
      font-size: 1.2rem;
    }

    a {
      display: block;
      color: #fff;
      text-decoration: none;
      margin-bottom: 0.8rem;
      transition: color 0.3s ease;

      &:hover {
        color: #ffd700;
      }
    }

    .social-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      img {
        width: 20px;
        height: 20px;
      }
    }
  }

  .footer-bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 2rem;
    text-align: center;
    color: #666;

    p {
      margin: 0.5rem 0;
    }
  }
}

@media (max-width: 1024px) {
  .the-footer {
    .footer-main {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .footer-brand {
      text-align: center;

      .footer-logo {
        margin: 0 auto 1rem;
      }
    }
  }
}

@media (max-width: 768px) {
  .the-footer {
    .footer-links {
      grid-template-columns: 1fr;
      text-align: center;
    }

    .footer-section {
      .social-link {
        justify-content: center;
      }
    }
  }
}
</style> 