<template>
  <div class="community-news">
    <h2>Последние новости</h2>
    <div class="news-grid">
      <article 
        v-for="news in newsItems" 
        :key="news.id"
        class="news-card"
      >
        <div class="news-image">
          <img :src="news.image" :alt="news.title">
        </div>
        <div class="news-content">
          <h3>{{ news.title }}</h3>
          <p>{{ news.excerpt }}</p>
          <div class="news-meta">
            <span class="news-date">{{ news.date }}</span>
            <a href="#" class="read-more">Читать далее</a>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const newsItems = ref([
  {
    id: 1,
    title: 'Новый конкурс скинов',
    excerpt: 'Примите участие в конкурсе на лучший скин для новых самолетов',
    image: '../../assets/images/community/news-1.jpg',
    date: '15 марта 2024'
  },
  {
    id: 2,
    title: 'Обновление редактора прицелов',
    excerpt: 'Добавлены новые функции для создания прицелов',
    image: '../../assets/images/community/news-2.jpg',
    date: '12 марта 2024'
  },
  {
    id: 3,
    title: 'Встреча сообщества',
    excerpt: 'Онлайн-встреча с разработчиками и активными участниками',
    image: '../../assets/images/community/news-3.jpg',
    date: '10 марта 2024'
  }
])
</script>

<style lang="scss" scoped>
.community-news {
  background: #E1E8EC;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(90,109,118,0.2);
  margin: 0 auto;
  max-width: 1200px;
  padding: 2rem;
  
  h2 {
    color: #4B9FAF;
    text-align: center;
    font-size: 2rem;
    margin-bottom: 2rem;
  }
  
  .news-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 2rem;
    
    .news-card {
      background: #CAD5DC;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(90,109,118,0.2);
      overflow: hidden;
      
      .news-image {
        height: 180px;
        overflow: hidden;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      
      .news-content {
        padding: 1.5rem;
        
        h3 {
          color: #4B9FAF;
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }
        
        p {
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
          
          .read-more {
            color: #4B9FAF;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s;
            
            &:hover {
              color: #5BB9B2;
            }
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .community-news {
    h2 {
      font-size: 2rem;
    }
  }
}
</style> 