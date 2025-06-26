<template>
  <section class="blog-header">
    <h1>{{ title }}</h1>
    <p>{{ subtitle }}</p>
  </section>
</template>

<script setup>
defineProps({
  title: String,
  subtitle: String
})
</script>

<style scoped lang="scss">
.blog-header {
  background: linear-gradient(rgba(202, 213, 220, 0.85), rgba(225, 232, 236, 0.95)), url('../../assets/images/blog-header-bg.jpg') center/cover;
  color: #5A6D76;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 2px 16px rgba(90,109,118,0.2);
  border-radius: 12px;

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

@media (max-width: 768px) {
  .blog-header {
    h1 {
      font-size: 2rem;
    }
    p {
      font-size: 1rem;
    }
  }
}
</style> 