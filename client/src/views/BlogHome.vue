<template>
  <div class="blog-home">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Блог ThunderCraft: Твой гид в мире кастомизации War Thunder</h1>
        <p class="hero-subtitle">Новости, гайды, конкурсы и вдохновение для создания уникальных прицелов и скинов.</p>
        <div class="hero-buttons">
          <button class="btn btn-primary">Читать последние посты</button>
          <button class="btn btn-secondary">Создать свой прицел/скин</button>
        </div>
      </div>
    </section>

    <!-- Featured Posts -->
    <section class="featured-posts">
      <h2 class="section-title">Популярные посты</h2>
      <div class="posts-grid">
        <article v-for="post in featuredPosts" :key="post.id" class="post-card">
          <div class="post-image">
            <img :src="post.image" :alt="post.title">
          </div>
          <div class="post-content">
            <h3 class="post-title">{{ post.title }}</h3>
            <p class="post-excerpt">{{ post.excerpt }}</p>
            <div class="post-meta">
              <span class="post-date">{{ post.date }}</span>
              <span class="post-author">{{ post.author }}</span>
              <span class="post-views">{{ post.views }} просмотров</span>
            </div>
            <button class="btn btn-text">Читать далее</button>
          </div>
        </article>
      </div>
    </section>

    <!-- Blog Categories -->
    <section class="blog-categories">
      <h2 class="section-title">Категории блога</h2>
      <div class="categories-grid">
        <button 
          v-for="category in categories" 
          :key="category.id"
          class="category-btn"
          :class="category.class"
          @click="selectCategory(category.id)"
        >
          {{ category.name }}
        </button>
      </div>
    </section>

    <!-- Recent News -->
    <section class="recent-news">
      <h2 class="section-title">Последние новости</h2>
      <div class="news-list">
        <article v-for="news in recentNews" :key="news.id" class="news-item">
          <h3 class="news-title">{{ news.title }}</h3>
          <p class="news-excerpt">{{ news.excerpt }}</p>
          <div class="news-meta">
            <span class="news-date">{{ news.date }}</span>
            <button class="btn btn-text">Читать</button>
          </div>
        </article>
      </div>
      <button class="btn btn-outline">Показать больше</button>
    </section>

    <!-- Community CTA -->
    <section class="community-cta">
      <div class="cta-content">
        <h2 class="cta-title">Стань частью ThunderCraft!</h2>
        <p class="cta-text">Делись своими прицелами и скинами, участвуй в конкурсах и вдохновляй других игроков War Thunder.</p>
        <div class="cta-buttons">
          <button class="btn btn-primary">Создать профиль</button>
          <button class="btn btn-secondary">Перейти в Discord</button>
        </div>
        <div class="social-share">
          <button class="social-btn vk">VK</button>
          <button class="social-btn twitter">Twitter</button>
          <button class="social-btn reddit">Reddit</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const featuredPosts = ref([
  {
    id: 1,
    title: 'Как создать исторический прицел для T-34',
    excerpt: 'Подробное руководство по созданию аутентичного прицела для легендарного советского танка.',
    image: '/images/featured/t34-sight.jpg',
    date: '15.03.2024',
    author: 'Иван Петров',
    views: 1234
  },
  // Добавьте больше постов здесь
])

const categories = ref([
  { id: 1, name: 'Новости платформы', class: 'category-news' },
  { id: 2, name: 'Гайды по прицелам', class: 'category-guides' },
  { id: 3, name: 'Гайды по скинам', class: 'category-skins' },
  { id: 4, name: 'Конкурсы', class: 'category-contests' },
  { id: 5, name: 'Исторические справки', class: 'category-history' },
  { id: 6, name: 'Советы сообщества', class: 'category-community' }
])

const recentNews = ref([
  {
    id: 1,
    title: 'Новый конкурс скинов для немецкой техники',
    excerpt: 'Примите участие в конкурсе и выиграйте премиум-аккаунт на 30 дней!',
    date: '14.03.2024'
  },
  // Добавьте больше новостей здесь
])

const selectCategory = (categoryId) => {
  // Логика фильтрации постов по категории
  console.log('Selected category:', categoryId)
}
</script>

<style lang="scss">
.blog-home {
  background: #E1E8EC;
  min-height: 100vh;
  .hero-section {
    min-height: 600px;
    background: linear-gradient(rgba(202, 213, 220, 0.85), rgba(225, 232, 236, 0.95)), url('/images/hero-bg.jpg') center/cover;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #5A6D76;
    padding: 2rem;
    .hero-content {
      max-width: 800px;
    }
    .hero-title {
      font-size: 3rem;
      margin-bottom: 1rem;
      font-family: 'War Thunder', sans-serif;
      text-transform: uppercase;
      color: #4B9FAF;
    }
    .hero-subtitle {
      font-size: 1.5rem;
      margin-bottom: 2rem;
      opacity: 0.95;
      color: #5A6D76;
    }
    .hero-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      .btn {
        background: #4B9FAF;
        color: #fff;
        border-radius: 4px;
        padding: 1rem 2rem;
        font-weight: 500;
        font-size: 1.1rem;
        border: none;
        box-shadow: 0 2px 8px rgba(90,109,118,0.2);
        transition: background 0.3s, color 0.3s, transform 0.3s;
        &:hover {
          background: #5BB9B2;
          color: #fff;
          transform: translateY(-2px);
        }
      }
      .btn-secondary {
        background: #CAD5DC;
        color: #5A6D76;
        border: 2px solid #4B9FAF;
        &:hover {
          background: #5BB9B2;
          color: #fff;
        }
      }
    }
  }
  .section-title {
    font-size: 2rem;
    margin-bottom: 2rem;
    text-align: center;
    color: #4B9FAF;
  }
  .posts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    padding: 2rem;
  }
  .post-card {
    background: #E1E8EC;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(90,109,118,0.2);
    transition: transform 0.3s ease, background 0.3s, color 0.3s;
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
      }
    }
    .post-content {
      padding: 1.5rem;
      .post-title {
        color: #4B9FAF;
        font-size: 1.3rem;
        margin-bottom: 0.5rem;
      }
      .post-excerpt {
        color: #5A6D76;
        margin-bottom: 1rem;
      }
      .post-meta {
        color: #5A6D76;
        font-size: 0.95rem;
        margin-bottom: 1rem;
        span {
          margin-right: 1rem;
        }
      }
      .btn-text {
        background: none;
        color: #4B9FAF;
        border: none;
        cursor: pointer;
        font-weight: 500;
        transition: color 0.3s;
        &:hover {
          color: #5BB9B2;
        }
      }
    }
  }
  .featured-posts, .recent-news, .blog-categories {
    background: #CAD5DC;
    border-radius: 12px;
    box-shadow: 0 2px 16px rgba(90,109,118,0.2);
    margin: 2rem auto;
    max-width: 1200px;
    padding: 2rem;
  }
  .news-list {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    .news-item {
      background: #E1E8EC;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(90,109,118,0.2);
      padding: 1.5rem;
      .news-title {
        color: #4B9FAF;
        font-size: 1.2rem;
        margin-bottom: 0.5rem;
      }
      .news-excerpt {
        color: #5A6D76;
        margin-bottom: 0.5rem;
      }
      .news-meta {
        color: #5A6D76;
        font-size: 0.95rem;
        .news-date {
          color: #5BB9B2;
          margin-right: 1rem;
        }
        .btn-text {
          background: none;
          color: #4B9FAF;
          border: none;
          cursor: pointer;
          font-weight: 500;
          transition: color 0.3s;
          &:hover {
            color: #5BB9B2;
          }
        }
      }
    }
  }
  .btn-outline {
    background: none;
    color: #4B9FAF;
    border: 2px solid #4B9FAF;
    border-radius: 4px;
    padding: 0.75rem 2rem;
    font-weight: 500;
    transition: background 0.3s, color 0.3s;
    margin: 2rem auto 0 auto;
    display: block;
    &:hover {
      background: #5BB9B2;
      color: #fff;
    }
  }
  .categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
    .category-btn {
      background: #E1E8EC;
      color: #5A6D76;
      border: 2px solid #CAD5DC;
      border-radius: 6px;
      padding: 0.75rem 1.5rem;
      font-weight: 500;
      font-size: 1rem;
      transition: background 0.3s, color 0.3s, border 0.3s;
      cursor: pointer;
      &:hover, &.active {
        background: #5BB9B2;
        color: #fff;
        border-color: #5BB9B2;
      }
    }
  }
  .community-cta {
    background: linear-gradient(rgba(202, 213, 220, 0.85), rgba(225, 232, 236, 0.95)), url('/images/community-bg.jpg') center/cover;
    color: #5A6D76;
    padding: 4rem 2rem;
    text-align: center;
    border-radius: 12px;
    box-shadow: 0 2px 16px rgba(90,109,118,0.2);
    .cta-content {
      max-width: 800px;
      margin: 0 auto;
    }
    .cta-title {
      color: #4B9FAF;
      font-size: 2rem;
      margin-bottom: 1.5rem;
    }
    .cta-text {
      color: #5A6D76;
      font-size: 1.2rem;
      margin-bottom: 2rem;
    }
    .cta-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin: 2rem 0;
      .btn-primary {
        background: #4B9FAF;
        color: #fff;
        border: none;
        border-radius: 4px;
        padding: 1rem 2rem;
        font-weight: 500;
        font-size: 1.1rem;
        box-shadow: 0 2px 8px rgba(90,109,118,0.2);
        transition: background 0.3s, color 0.3s, transform 0.3s;
        &:hover {
          background: #5BB9B2;
          color: #fff;
          transform: translateY(-2px);
        }
      }
      .btn-secondary {
        background: #CAD5DC;
        color: #5A6D76;
        border: 2px solid #4B9FAF;
        border-radius: 4px;
        padding: 1rem 2rem;
        font-weight: 500;
        font-size: 1.1rem;
        transition: background 0.3s, color 0.3s;
        &:hover {
          background: #5BB9B2;
          color: #fff;
        }
      }
    }
    .social-share {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 2rem;
      .social-btn {
        background: #E1E8EC;
        color: #4B9FAF;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        font-size: 1.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.3s, color 0.3s;
        cursor: pointer;
        &:hover {
          background: #5BB9B2;
          color: #fff;
        }
      }
    }
  }
}

// Адаптивность
@media (max-width: 768px) {
  .blog-home {
    .hero-section {
      min-height: 400px;

      .hero-title {
        font-size: 2rem;
      }

      .hero-subtitle {
        font-size: 1.25rem;
      }

      .hero-buttons {
        flex-direction: column;
      }
    }

    .posts-grid {
      grid-template-columns: 1fr;
    }

    .categories-grid {
      grid-template-columns: 1fr 1fr;
    }
  }
}
</style> 