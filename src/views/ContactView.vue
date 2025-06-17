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
  .contact-header {
    background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)),
                url('../assets/images/contact-header-bg.jpg') center/cover;
    color: #fff;
    padding: 4rem 2rem;
    text-align: center;

    h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
      font-family: 'War Thunder', sans-serif;
    }

    p {
      font-size: 1.25rem;
      opacity: 0.9;
    }
  }

  .contact-content {
    padding: 4rem 2rem;
    background: #1a1a1a;
    color: #fff;

    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .contact-info {
      h2 {
        color: #ffd700;
        margin-bottom: 2rem;
        font-size: 2rem;
      }

      .info-items {
        display: grid;
        gap: 2rem;
      }

      .info-item {
        background: rgba(255, 255, 255, 0.05);
        padding: 2rem;
        border-radius: 8px;

        h3 {
          color: #ffd700;
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }

        p {
          color: #999;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          text-decoration: none;
          border-radius: 4px;
          transition: all 0.3s ease;

          img {
            width: 24px;
            height: 24px;
          }

          &:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
          }

          &.btn-discord {
            background: #7289da;
            &:hover { background: #677bc4; }
          }

          &.btn-vk {
            background: #4c75a3;
            &:hover { background: #3b5998; }
          }

          &.btn-email {
            background: #ffd700;
            color: #000;
            &:hover { background: #ffed4a; }
          }
        }
      }
    }

    .contact-form {
      h2 {
        color: #ffd700;
        margin-bottom: 2rem;
        font-size: 2rem;
      }

      .form-group {
        margin-bottom: 1.5rem;

        label {
          display: block;
          margin-bottom: 0.5rem;
          color: #fff;
        }

        input,
        select,
        textarea {
          width: 100%;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          color: #fff;
          font-size: 1rem;

          &::placeholder {
            color: rgba(255, 255, 255, 0.5);
          }

          &:focus {
            outline: none;
            border-color: #ffd700;
          }
        }

        select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ffd700' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          background-size: 1rem;
          padding-right: 2.5rem;
        }
      }

      .btn-primary {
        width: 100%;
        padding: 1rem;
        background: #ffd700;
        color: #000;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover:not(:disabled) {
          background: #ffed4a;
          transform: translateY(-2px);
        }

        &:disabled {
          opacity: 0.7;
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