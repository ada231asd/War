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
  background: #E1E8EC;
  border: 1.5px solid #CAD5DC;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.3s ease, background 0.3s, color 0.3s;
  box-shadow: 0 2px 8px rgba(90,109,118,0.2);

  &:hover {
    transform: translateY(-5px);
    background: #5BB9B2;
    color: #fff;
    h3, p { color: #fff; }
  }

  h3 {
    color: #4B9FAF;
    margin-bottom: 1rem;
    font-size: 1.5rem;
    transition: color 0.3s;
  }

  p {
    color: #5A6D76;
    line-height: 1.6;
    transition: color 0.3s;
  }
}
</style> 