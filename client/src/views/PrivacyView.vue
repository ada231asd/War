<template>
  <div class="privacy-view">
    <section class="privacy-header">
      <h1>Политика конфиденциальности</h1>
      <p>Последнее обновление: 17 марта 2024</p>
    </section>

    <section class="privacy-content">
      <div class="privacy-container">
        <div class="privacy-section">
          <h2>1. Сбор информации</h2>
          <p>Мы собираем следующие типы информации:</p>
          <ul>
            <li>Информация, которую вы предоставляете при регистрации (имя, email)</li>
            <li>Информация о вашем устройстве и браузере</li>
            <li>Данные об использовании сервиса</li>
            <li>Информация о созданных вами прицелах и скинах</li>
          </ul>
        </div>

        <div class="privacy-section">
          <h2>2. Использование информации</h2>
          <p>Мы используем собранную информацию для:</p>
          <ul>
            <li>Предоставления и улучшения наших услуг</li>
            <li>Обработки ваших запросов и поддержки</li>
            <li>Отправки важных уведомлений</li>
            <li>Анализа использования сервиса</li>
          </ul>
        </div>

        <div class="privacy-section">
          <h2>3. Защита информации</h2>
          <p>Мы принимаем следующие меры для защиты вашей информации:</p>
          <ul>
            <li>Шифрование данных при передаче</li>
            <li>Регулярное обновление систем безопасности</li>
            <li>Ограничение доступа к личной информации</li>
            <li>Мониторинг и предотвращение несанкционированного доступа</li>
          </ul>
        </div>

        <div class="privacy-section">
          <h2>4. Обмен информацией</h2>
          <p>Мы не продаем и не передаем вашу личную информацию третьим лицам, за исключением случаев:</p>
          <ul>
            <li>Когда это необходимо для предоставления услуг</li>
            <li>Когда это требуется по закону</li>
            <li>С вашего явного согласия</li>
          </ul>
        </div>

        <div class="privacy-section">
          <h2>5. Ваши права</h2>
          <p>Вы имеете право:</p>
          <ul>
            <li>Получить доступ к вашей личной информации</li>
            <li>Исправить неточные данные</li>
            <li>Запросить удаление ваших данных</li>
            <li>Отозвать согласие на обработку данных</li>
          </ul>
        </div>

        <div class="privacy-section">
          <h2>6. Cookies</h2>
          <p>Мы используем cookies для:</p>
          <ul>
            <li>Запоминания ваших предпочтений</li>
            <li>Анализа использования сайта</li>
            <li>Улучшения производительности</li>
          </ul>
        </div>

        <div class="privacy-section">
          <h2>7. Контакты</h2>
          <p>Если у вас есть вопросы о нашей политике конфиденциальности, вы можете связаться с нами:</p>
          <ul>
            <li>Email: privacy@thundercraft.com</li>
            <li>Discord: ThunderCraft Support</li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Компонент не требует дополнительной логики
</script>

<style lang="scss">
.privacy-view {
  background: #E1E8EC;
  min-height: 100vh;
  .privacy-header {
    background: linear-gradient(rgba(202, 213, 220, 0.85), rgba(225, 232, 236, 0.95)), url('../assets/images/privacy-header-bg.jpg') center/cover;
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
  .privacy-content {
    padding: 4rem 2rem;
    background: #CAD5DC;
    color: #5A6D76;
    .privacy-container {
      max-width: 800px;
      margin: 0 auto;
    }
    .privacy-section {
      margin-bottom: 3rem;
      background: #E1E8EC;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(90,109,118,0.2);
      padding: 2rem;
      h2 {
        color: #4B9FAF;
        margin-bottom: 1.5rem;
        font-size: 1.8rem;
      }
      p {
        color: #5A6D76;
        margin-bottom: 1rem;
        line-height: 1.6;
      }
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        li {
          color: #5A6D76;
          margin-bottom: 0.75rem;
          padding-left: 1.5rem;
          position: relative;
          line-height: 1.6;
          &:before {
            content: "•";
            color: #5BB9B2;
            position: absolute;
            left: 0;
          }
        }
      }
      a {
        color: #4B9FAF;
        text-decoration: underline;
        transition: color 0.3s;
        &:hover {
          color: #5BB9B2;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .privacy-view {
    .privacy-header {
      h1 {
        font-size: 2rem;
      }

      p {
        font-size: 1rem;
      }
    }

    .privacy-content {
      .privacy-section {
        h2 {
          font-size: 1.5rem;
        }
      }
    }
  }
}
</style> 