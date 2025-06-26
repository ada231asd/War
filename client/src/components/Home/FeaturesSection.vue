<template>
  <section class="features">
    <h2>Возможности</h2>
    <div class="features-grid">
      <FeatureCard
        v-for="feature in features"
        :key="feature.title"
        :title="feature.title"
        :description="feature.description"
      />
    </div>
  </section>
</template>

<script setup>
import FeatureCard from './FeatureCard.vue'

const features = [
  {
    title: 'Редактор прицелов',
    description: 'Создавайте и настраивайте прицелы для любой техники'
  },
  {
    title: 'Редактор скинов',
    description: 'Разрабатывайте уникальные скины для вашей техники'
  },
  {
    title: 'Библиотека',
    description: 'Делитесь своими работами с сообществом'
  }
]
</script>

<style lang="scss" scoped>
.features {
  padding: 4rem 2rem;
  background: #CAD5DC;
  color: #5A6D76;

  h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
    font-family: 'War Thunder', sans-serif;
    color: #4B9FAF;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
}
</style> 