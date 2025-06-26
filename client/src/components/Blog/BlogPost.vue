<template>
  <article class="blog-post">
    <div class="post-image">
      <img :src="post.image" :alt="post.title">
    </div>
    <div class="post-content">
      <h2>{{ post.title }}</h2>
      <p class="post-excerpt">{{ post.excerpt }}</p>
      <div class="post-meta">
        <span class="post-date">{{ post.date }}</span>
        <span class="post-category">{{ post.category }}</span>
      </div>
      <router-link :to="'/blog/' + post.id" class="read-more">Читать далее</router-link>
    </div>
  </article>
</template>

<script setup>
defineProps({
  post: Object
})
</script>

<style scoped lang="scss">
.blog-post {
  background: #E1E8EC;
  border-radius: 8px;
  border: 1.5px solid #CAD5DC;
  overflow: hidden;
  transition: transform 0.3s ease, background 0.3s, color 0.3s;
  box-shadow: 0 2px 8px rgba(90,109,118,0.2);

  &:hover {
    transform: translateY(-5px);
    background: #CAD5DC;
  }

  .post-image {
    height: 200px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
  }

  &:hover .post-image img {
    transform: scale(1.1);
  }

  .post-content {
    padding: 1.5rem;

    h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: #4B9FAF;
    }

    .post-excerpt {
      color: #5A6D76;
      margin-bottom: 1rem;
      line-height: 1.6;
    }

    .post-meta {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      font-size: 0.9rem;
      color: #5A6D76;

      .post-category {
        color: #5BB9B2;
      }
    }

    .read-more {
      display: inline-block;
      color: #4B9FAF;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s ease;

      &:hover {
        color: #5BB9B2;
      }
    }
  }
}
</style> 