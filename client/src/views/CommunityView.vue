<template>
  <div class="community-view">
    <section class="community-header">
      <h1>Сообщество</h1>
      <p>Присоединяйтесь к сообществу разработчиков и энтузиастов War Thunder</p>
    </section>

    <section class="community-content">
      <div class="community-grid">
        <div class="community-card discord">
          <div class="card-icon">
            <img src="../assets/images/discord-icon.svg" alt="Discord">
          </div>
          <h3>Discord</h3>
          <p>Присоединяйтесь к нашему Discord-серверу для общения и обмена опытом</p>
          <a href="#" class="btn btn-primary">Присоединиться</a>
        </div>

        <div class="community-card vk">
          <div class="card-icon">
            <img src="../assets/images/vk-icon.svg" alt="VK">
          </div>
          <h3>ВКонтакте</h3>
          <p>Следите за новостями и общайтесь в нашей группе ВКонтакте</p>
          <a href="#" class="btn btn-primary">Подписаться</a>
        </div>

        <div class="community-card reddit">
          <div class="card-icon">
            <img src="../assets/images/reddit-icon.svg" alt="Reddit">
          </div>
          <h3>Reddit</h3>
          <p>Участвуйте в обсуждениях на нашем сабреддите</p>
          <a href="#" class="btn btn-primary">Присоединиться</a>
        </div>

        <div class="community-card youtube">
          <div class="card-icon">
            <img src="../assets/images/youtube-icon.svg" alt="YouTube">
          </div>
          <h3>YouTube</h3>
          <p>Смотрите обучающие видео и обзоры на нашем канале</p>
          <a href="#" class="btn btn-primary">Подписаться</a>
        </div>
      </div>

      <div class="community-features">
        <h2>Возможности сообщества</h2>
        <div class="features-grid">
          <div class="feature-card">
            <h3>Обмен опытом</h3>
            <p>Делитесь своими знаниями и учитесь у других участников сообщества</p>
          </div>
          <div class="feature-card">
            <h3>Совместная работа</h3>
            <p>Создавайте проекты вместе с другими разработчиками</p>
          </div>
          <div class="feature-card">
            <h3>Конкурсы</h3>
            <p>Участвуйте в конкурсах и выигрывайте призы</p>
          </div>
          <div class="feature-card">
            <h3>Поддержка</h3>
            <p>Получайте помощь от опытных участников сообщества</p>
          </div>
        </div>
      </div>

      <div class="community-news">
        <h2>Последние новости</h2>
        <div class="news-grid">
          <article class="news-card" v-for="news in newsItems" :key="news.id">
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
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const newsItems = ref([
  {
    id: 1,
    title: 'Новый конкурс скинов',
    excerpt: 'Примите участие в конкурсе на лучший скин для новых самолетов',
    image: '../assets/images/community/news-1.jpg',
    date: '15 марта 2024'
  },
  {
    id: 2,
    title: 'Обновление редактора прицелов',
    excerpt: 'Добавлены новые функции для создания прицелов',
    image: '../assets/images/community/news-2.jpg',
    date: '12 марта 2024'
  },
  {
    id: 3,
    title: 'Встреча сообщества',
    excerpt: 'Онлайн-встреча с разработчиками и активными участниками',
    image: '../assets/images/community/news-3.jpg',
    date: '10 марта 2024'
  }
])
</script>

<style lang="scss">
.community-view {
  background: #E1E8EC;
  min-height: 100vh;
  .community-header {
    background: linear-gradient(rgba(202, 213, 220, 0.85), rgba(225, 232, 236, 0.95)), url('../assets/images/community-header-bg.jpg') center/cover;
    color: #5A6D76;
    padding: 4rem 2rem;
    text-align: center;
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
  .community-content {
    padding: 4rem 2rem;
    background: #CAD5DC;
    color: #5A6D76;
    .community-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto 4rem;
    }
    .community-card {
      background: #E1E8EC;
      border-radius: 8px;
      padding: 2rem;
      text-align: center;
      transition: transform 0.3s ease, background 0.3s, color 0.3s;
      box-shadow: 0 2px 8px rgba(90,109,118,0.2);
      &:hover {
        transform: translateY(-5px);
        background: #CAD5DC;
      }
      .card-icon {
        width: 64px;
        height: 64px;
        margin: 0 auto 1.5rem;
        img {
          width: 100%;
          height: 100%;
        }
      }
      h3 {
        color: #4B9FAF;
        margin-bottom: 1rem;
        font-size: 1.5rem;
      }
      p {
        color: #5A6D76;
        margin-bottom: 1.5rem;
        line-height: 1.6;
      }
      .btn {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        background: #4B9FAF;
        color: #fff;
        text-decoration: none;
        border-radius: 4px;
        font-weight: 500;
        transition: background 0.3s, color 0.3s, transform 0.3s;
        &:hover {
          background: #5BB9B2;
          color: #fff;
          transform: translateY(-2px);
        }
      }
    }
    .community-features {
      background: #E1E8EC;
      border-radius: 12px;
      box-shadow: 0 2px 16px rgba(90,109,118,0.2);
      margin: 0 auto 4rem auto;
      max-width: 1200px;
      padding: 2rem;
      h2 {
        color: #4B9FAF;
        text-align: center;
        font-size: 2rem;
        margin-bottom: 2rem;
      }
      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 2rem;
        .feature-card {
          background: #CAD5DC;
          border-radius: 8px;
          padding: 1.5rem;
          text-align: center;
          box-shadow: 0 2px 8px rgba(90,109,118,0.2);
          h3 {
            color: #4B9FAF;
            margin-bottom: 1rem;
            font-size: 1.2rem;
          }
          p {
            color: #5A6D76;
            line-height: 1.6;
          }
        }
      }
    }
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
  }
}

@media (max-width: 768px) {
  .community-view {
    .community-header {
      h1 {
        font-size: 2rem;
      }

      p {
        font-size: 1rem;
      }
    }

    .community-content {
      .community-features,
      .community-news {
        h2 {
          font-size: 2rem;
        }
      }
    }
  }
}
</style> 