<template>
  <div class="blog-view">
    <BlogHeader
      title="Блог ThunderCraft"
      subtitle="Новости, обзоры и руководства по созданию прицелов и скинов"
    />
    <section class="blog-content">
      <BlogGrid :posts="posts" />
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BlogHeader from '../components/Blog/BlogHeader.vue'
import BlogGrid from '../components/Blog/BlogGrid.vue'

const posts = ref([
  {
    id: 1,
    title: 'Как создать свой первый прицел',
    excerpt: 'Пошаговое руководство по созданию прицела для танков в War Thunder',
    image: '../assets/images/blog/post-1.jpg',
    date: '15 марта 2024',
    category: 'Руководства'
  },
  {
    id: 2,
    title: 'Топ-10 скинов для самолетов',
    excerpt: 'Лучшие скины для самолетов, созданные сообществом',
    image: '../assets/images/blog/post-2.jpg',
    date: '12 марта 2024',
    category: 'Обзоры'
  },
  {
    id: 3,
    title: 'Новые возможности редактора',
    excerpt: 'Обзор новых функций в редакторе прицелов и скинов',
    image: '../assets/images/blog/post-3.jpg',
    date: '10 марта 2024',
    category: 'Новости'
  }
])
</script>

<style lang="scss">
.blog-view {
  .blog-content {
    padding: 4rem 2rem;
    background: #1a1a1a;
    color: #fff;
  }
}
</style> 