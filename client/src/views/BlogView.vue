<template>
  <div class="blog-view">
    <section class="blog-header">
      <h1>Блог ThunderCraft</h1>
      <p>Новости, обзоры и руководства по созданию прицелов и скинов</p>
    </section>

    <section class="blog-content">
      <div class="blog-grid">
        <article class="blog-post" v-for="post in posts" :key="post.id">
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
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

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
  .blog-header {
    background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)),
                url('../assets/images/blog-header-bg.jpg') center/cover;
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

  .blog-content {
    padding: 4rem 2rem;
    background: #1a1a1a;
    color: #fff;

    .blog-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .blog-post {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      overflow: hidden;
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-5px);
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
          color: #ffd700;
        }

        .post-excerpt {
          color: #999;
          margin-bottom: 1rem;
          line-height: 1.6;
        }

        .post-meta {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          color: #666;

          .post-category {
            color: #ffd700;
          }
        }

        .read-more {
          display: inline-block;
          color: #ffd700;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;

          &:hover {
            color: #ffed4a;
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .blog-view {
    .blog-header {
      h1 {
        font-size: 2rem;
      }

      p {
        font-size: 1rem;
      }
    }
  }
}
</style> 