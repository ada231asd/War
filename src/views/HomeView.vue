<template>
  <div class="home-view">
    <section class="hero">
      <div class="hero-content">
        <h1>Добро пожаловать в ThunderCraft</h1>
        <p>Создавайте уникальные прицелы и скины для War Thunder</p>
        <div class="hero-buttons">
          <router-link to="/sight-editor" class="btn btn-primary">Редактор прицелов</router-link>
          <router-link to="/skin-editor" class="btn btn-secondary">Редактор скинов</router-link>
        </div>
      </div>
    </section>

    <section class="features">
      <h2>Возможности</h2>
      <div class="features-grid">
        <div class="feature-card">
          <h3>Редактор прицелов</h3>
          <p>Создавайте и настраивайте прицелы для любой техники</p>
        </div>
        <div class="feature-card">
          <h3>Редактор скинов</h3>
          <p>Разрабатывайте уникальные скины для вашей техники</p>
        </div>
        <div class="feature-card">
          <h3>Библиотека</h3>
          <p>Делитесь своими работами с сообществом</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Компонент домашней страницы
</script>

<style lang="scss">
.home-view {
  .hero {
    min-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
                url('../assets/images/hero-bg.jpg') center/cover;
    color: #fff;

    .hero-content {
      max-width: 800px;
      padding: 2rem;

      h1 {
        font-size: 3rem;
        margin-bottom: 1rem;
        font-family: 'War Thunder', sans-serif;
      }

      p {
        font-size: 1.25rem;
        margin-bottom: 2rem;
        opacity: 0.9;
      }
    }

    .hero-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;

      .btn {
        padding: 1rem 2rem;
        border-radius: 4px;
        text-decoration: none;
        font-weight: 500;
        transition: all 0.3s ease;

        &.btn-primary {
          background: #ffd700;
          color: #000;

          &:hover {
            background: #ffed4a;
            transform: translateY(-2px);
          }
        }

        &.btn-secondary {
          background: transparent;
          border: 2px solid #ffd700;
          color: #ffd700;

          &:hover {
            background: rgba(255, 215, 0, 0.1);
            transform: translateY(-2px);
          }
        }
      }
    }
  }

  .features {
    padding: 4rem 2rem;
    background: #1a1a1a;
    color: #fff;

    h2 {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 3rem;
      font-family: 'War Thunder', sans-serif;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .feature-card {
      background: rgba(255, 255, 255, 0.05);
      padding: 2rem;
      border-radius: 8px;
      text-align: center;
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-5px);
      }

      h3 {
        color: #ffd700;
        margin-bottom: 1rem;
        font-size: 1.5rem;
      }

      p {
        color: #999;
        line-height: 1.6;
      }
    }
  }
}

@media (max-width: 768px) {
  .home-view {
    .hero {
      .hero-content {
        h1 {
          font-size: 2rem;
        }

        p {
          font-size: 1rem;
        }
      }

      .hero-buttons {
        flex-direction: column;
      }
    }
  }
}
</style> 