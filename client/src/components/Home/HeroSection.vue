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
  background: linear-gradient(rgba(202, 213, 220, 0.85), rgba(225, 232, 236, 0.95)),
              url('@/assets/images/hero-bg.jpg') center/cover;
  color: #5A6D76;

  .hero-content {
    max-width: 800px;
    padding: 2rem;

    h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
      font-family: 'War Thunder', sans-serif;
      color: #4B9FAF;
    }

    p {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      opacity: 0.95;
      color: #5A6D76;
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
      font-size: 1.1rem;
      box-shadow: 0 2px 8px rgba(90,109,118,0.2);

      &.btn-primary {
        background: #4B9FAF;
        color: #fff;
        border: none;
        &:hover {
          background: #5BB9B2;
          color: #fff;
          transform: translateY(-2px);
        }
      }

      &.btn-secondary {
        background: #CAD5DC;
        border: 2px solid #4B9FAF;
        color: #5A6D76;
        &:hover {
          background: #5BB9B2;
          color: #fff;
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