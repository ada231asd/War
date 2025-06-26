<template>
  <div class="contact-view">
    <section class="contact-header">
      <h1>Свяжитесь с нами</h1>
      <p>Мы всегда готовы помочь вам с любыми вопросами</p>
    </section>

    <section class="contact-content">
      <div class="contact-grid">
        <div class="contact-info">
          <h2>Контактная информация</h2>
          <div class="info-items">
            <div class="info-item">
              <h3>Discord</h3>
              <p>Присоединяйтесь к нашему серверу для быстрой поддержки</p>
              <a href="#" class="btn btn-discord">
                <img src="../assets/images/discord-icon.svg" alt="Discord">
                Присоединиться
              </a>
            </div>

            <div class="info-item">
              <h3>ВКонтакте</h3>
              <p>Следите за новостями и общайтесь в нашей группе</p>
              <a href="#" class="btn btn-vk">
                <img src="../assets/images/vk-icon.svg" alt="VK">
                Подписаться
              </a>
            </div>

            <div class="info-item">
              <h3>Email</h3>
              <p>Напишите нам на почту</p>
              <a href="mailto:support@thundercraft.com" class="btn btn-email">
                support@thundercraft.com
              </a>
            </div>
          </div>
        </div>

        <div class="contact-form">
          <h2>Отправить сообщение</h2>
          <form @submit.prevent="submitForm">
            <div class="form-group">
              <label for="name">Ваше имя</label>
              <input 
                type="text" 
                id="name" 
                v-model="form.name" 
                required
                placeholder="Введите ваше имя"
              >
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                v-model="form.email" 
                required
                placeholder="Введите ваш email"
              >
            </div>

            <div class="form-group">
              <label for="subject">Тема</label>
              <select id="subject" v-model="form.subject" required>
                <option value="">Выберите тему</option>
                <option value="general">Общий вопрос</option>
                <option value="technical">Техническая поддержка</option>
                <option value="bug">Сообщить об ошибке</option>
                <option value="suggestion">Предложение</option>
              </select>
            </div>

            <div class="form-group">
              <label for="message">Сообщение</label>
              <textarea 
                id="message" 
                v-model="form.message" 
                required
                placeholder="Введите ваше сообщение"
                rows="5"
              ></textarea>
            </div>

            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              {{ isSubmitting ? 'Отправка...' : 'Отправить сообщение' }}
            </button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)

const submitForm = async () => {
  isSubmitting.value = true
  
  try {
    // Здесь будет логика отправки формы
    await new Promise(resolve => setTimeout(resolve, 1000)) // Имитация отправки
    alert('Сообщение успешно отправлено!')
    form.value = {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  } catch (error) {
    alert('Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте позже.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss">
.contact-view {
  background: #E1E8EC;
  min-height: 100vh;
  .contact-header {
    background: linear-gradient(rgba(202, 213, 220, 0.85), rgba(225, 232, 236, 0.95)), url('../assets/images/contact-header-bg.jpg') center/cover;
    color: #5A6D76;
    padding: 4rem 2rem;
    text-align: center;
    h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
      font-family: 'War Thunder', sans-serif;
      color: #4B9FAF;
    }
    p {
      font-size: 1.25rem;
      opacity: 0.95;
      color: #5A6D76;
    }
  }
  .contact-content {
    padding: 4rem 2rem;
    background: #CAD5DC;
    color: #5A6D76;
    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    .contact-info {
      h2 {
        color: #4B9FAF;
        margin-bottom: 2rem;
        font-size: 2rem;
      }
      .info-items {
        display: grid;
        gap: 2rem;
      }
      .info-item {
        background: #E1E8EC;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(90,109,118,0.2);
        h3 {
          color: #4B9FAF;
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }
        p {
          color: #5A6D76;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #4B9FAF;
          color: #fff;
          border-radius: 4px;
          font-weight: 500;
          transition: background 0.3s, color 0.3s, transform 0.3s;
          &:hover {
            background: #5BB9B2;
            color: #fff;
            transform: translateY(-2px);
          }
        }
      }
    }
    .contact-form {
      background: #E1E8EC;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(90,109,118,0.2);
      padding: 2rem;
      h2 {
        color: #4B9FAF;
        margin-bottom: 2rem;
      }
      .form-group {
        margin-bottom: 1.5rem;
        label {
          display: block;
          margin-bottom: 0.5rem;
          color: #5A6D76;
        }
        input, select, textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 4px;
          border: 1px solid #4B9FAF;
          color: #5A6D76;
          background: #CAD5DC;
          font-size: 1rem;
          transition: border 0.3s;
          &:focus {
            outline: none;
            border-color: #5BB9B2;
          }
        }
      }
      .btn-primary {
        background: #4B9FAF;
        color: #fff;
        border-radius: 4px;
        padding: 1rem 2rem;
        font-weight: 500;
        font-size: 1.1rem;
        border: none;
        box-shadow: 0 2px 8px rgba(90,109,118,0.2);
        transition: background 0.3s, color 0.3s, transform 0.3s;
        &:hover {
          background: #5BB9B2;
          color: #fff;
          transform: translateY(-2px);
        }
        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .contact-view {
    .contact-header {
      h1 {
        font-size: 2rem;
      }

      p {
        font-size: 1rem;
      }
    }

    .contact-content {
      .contact-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
    }
  }
}
</style> 