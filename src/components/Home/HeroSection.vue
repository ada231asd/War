<template>
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
</template>

<script setup>
// Hero section component
</script>

<style lang="scss" scoped>
.hero {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
              url('@/assets/images/hero-bg.jpg') center/cover;
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

@media (max-width: 768px) {
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
</style> 