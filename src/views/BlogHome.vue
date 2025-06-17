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
  .hero-section {
    min-height: 600px;
    background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
                url('/images/hero-bg.jpg') center/cover;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #fff;
    padding: 2rem;

    .hero-content {
      max-width: 800px;
    }

    .hero-title {
      font-size: 3rem;
      margin-bottom: 1rem;
      font-family: 'War Thunder', sans-serif;
      text-transform: uppercase;
    }

    .hero-subtitle {
      font-size: 1.5rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }

    .hero-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
  }

  .section-title {
    font-size: 2rem;
    margin-bottom: 2rem;
    text-align: center;
    color: #333;
  }

  .posts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    padding: 2rem;
  }

  .post-card {
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
      }
    }

    .post-content {
      padding: 1.5rem;
    }

    .post-title {
      font-size: 1.25rem;
      margin-bottom: 1rem;
    }

    .post-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.875rem;
      color: #666;
      margin: 1rem 0;
    }
  }

  .categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    padding: 2rem;
  }

  .category-btn {
    padding: 1rem;
    border: none;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;

    &.category-news { background: #4a90e2; }
    &.category-guides { background: #2ecc71; }
    &.category-skins { background: #e74c3c; }
    &.category-contests { background: #f1c40f; }
    &.category-history { background: #95a5a6; }
    &.category-community { background: #9b59b6; }

    &:hover {
      transform: scale(1.05);
    }
  }

  .news-list {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  .news-item {
    padding: 1.5rem;
    border-bottom: 1px solid #eee;

    &:last-child {
      border-bottom: none;
    }
  }

  .community-cta {
    background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)),
                url('/images/community-bg.jpg') center/cover;
    color: #fff;
    padding: 4rem 2rem;
    text-align: center;

    .cta-content {
      max-width: 800px;
      margin: 0 auto;
    }

    .cta-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin: 2rem 0;
    }

    .social-share {
      display: flex;
      gap: 1rem;
      justify-content: center;
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