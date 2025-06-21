<template>
  <div class="terms-view">
    <section class="terms-header">
      <h1>Условия использования</h1>
      <p>Последнее обновление: 17 марта 2024</p>
    </section>

    <section class="terms-content">
      <div class="terms-container">
        <div class="terms-section">
          <h2>1. Принятие условий</h2>
          <p>Используя ThunderCraft, вы соглашаетесь с настоящими условиями использования. Если вы не согласны с этими условиями, пожалуйста, не используйте наш сервис.</p>
        </div>

        <div class="terms-section">
          <h2>2. Описание услуг</h2>
          <p>ThunderCraft предоставляет следующие услуги:</p>
          <ul>
            <li>Редактор прицелов для War Thunder</li>
            <li>Редактор скинов для War Thunder</li>
            <li>Библиотека пользовательского контента</li>
            <li>Сообщество разработчиков</li>
          </ul>
        </div>

        <div class="terms-section">
          <h2>3. Регистрация и учетная запись</h2>
          <p>Для использования некоторых функций сервиса требуется регистрация. При регистрации вы обязуетесь:</p>
          <ul>
            <li>Предоставить точную и актуальную информацию</li>
            <li>Сохранять конфиденциальность учетных данных</li>
            <li>Немедленно уведомлять нас о несанкционированном доступе</li>
            <li>Не передавать учетную запись третьим лицам</li>
          </ul>
        </div>

        <div class="terms-section">
          <h2>4. Правила использования</h2>
          <p>При использовании ThunderCraft запрещается:</p>
          <ul>
            <li>Нарушать законы и права третьих лиц</li>
            <li>Создавать контент, нарушающий правила War Thunder</li>
            <li>Использовать сервис для распространения вредоносного ПО</li>
            <li>Пытаться получить несанкционированный доступ к сервису</li>
            <li>Нарушать работу сервиса или других пользователей</li>
          </ul>
        </div>

        <div class="terms-section">
          <h2>5. Интеллектуальная собственность</h2>
          <p>В отношении интеллектуальной собственности:</p>
          <ul>
            <li>ThunderCraft сохраняет права на сервис и его компоненты</li>
            <li>Пользователи сохраняют права на созданный ими контент</li>
            <li>При публикации контента вы предоставляете нам лицензию на его использование</li>
            <li>Вы гарантируете, что имеете права на публикуемый контент</li>
          </ul>
        </div>

        <div class="terms-section">
          <h2>6. Ограничение ответственности</h2>
          <p>ThunderCraft не несет ответственности за:</p>
          <ul>
            <li>Потерю данных или ущерб от использования сервиса</li>
            <li>Действия других пользователей</li>
            <li>Контент, созданный пользователями</li>
            <li>Временную недоступность сервиса</li>
          </ul>
        </div>

        <div class="terms-section">
          <h2>7. Изменение условий</h2>
          <p>Мы оставляем за собой право изменять эти условия в любое время. О существенных изменениях мы будем уведомлять пользователей через:</p>
          <ul>
            <li>Уведомления на сайте</li>
            <li>Email-рассылку</li>
            <li>Объявления в социальных сетях</li>
          </ul>
        </div>

        <div class="terms-section">
          <h2>8. Прекращение использования</h2>
          <p>Мы можем приостановить или прекратить доступ к сервису в случае:</p>
          <ul>
            <li>Нарушения условий использования</li>
            <li>Длительного неиспользования аккаунта</li>
            <li>Запроса пользователя на удаление аккаунта</li>
          </ul>
        </div>

        <div class="terms-section">
          <h2>9. Контакты</h2>
          <p>По вопросам, связанным с условиями использования, обращайтесь:</p>
          <ul>
            <li>Email: terms@thundercraft.com</li>
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
.terms-view {
  .terms-header {
    background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)),
                url('../assets/images/terms-header-bg.jpg') center/cover;
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

  .terms-content {
    padding: 4rem 2rem;
    background: #1a1a1a;
    color: #fff;

    .terms-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .terms-section {
      margin-bottom: 3rem;

      h2 {
        color: #ffd700;
        margin-bottom: 1.5rem;
        font-size: 1.8rem;
      }

      p {
        color: #999;
        margin-bottom: 1rem;
        line-height: 1.6;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          color: #999;
          margin-bottom: 0.75rem;
          padding-left: 1.5rem;
          position: relative;
          line-height: 1.6;

          &:before {
            content: "•";
            color: #ffd700;
            position: absolute;
            left: 0;
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .terms-view {
    .terms-header {
      h1 {
        font-size: 2rem;
      }

      p {
        font-size: 1rem;
      }
    }

    .terms-content {
      .terms-section {
        h2 {
          font-size: 1.5rem;
        }
      }
    }
  }
}
</style> 