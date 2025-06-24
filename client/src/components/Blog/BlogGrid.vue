<template>
  <div class="blog-grid">
    <BlogPost v-for="post in posts" :key="post.id" :post="post" />
  </div>
</template>

<script setup>
import BlogPost from './BlogPost.vue'

defineProps({
  posts: Array
})
</script>

<style scoped lang="scss">
.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
</style> 