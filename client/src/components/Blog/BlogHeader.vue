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
  background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)),
              url('../../assets/images/blog-header-bg.jpg') center/cover;
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