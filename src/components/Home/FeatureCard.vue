<template>
  <div class="feature-card">
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
})
</script>

<style lang="scss" scoped>
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
</style> 