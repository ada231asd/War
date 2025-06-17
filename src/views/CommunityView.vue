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
  .community-header {
    background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)),
                url('../assets/images/community-header-bg.jpg') center/cover;
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

  .community-content {
    padding: 4rem 2rem;
    background: #1a1a1a;
    color: #fff;

    .community-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto 4rem;
    }

    .community-card {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      padding: 2rem;
      text-align: center;
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-5px);
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
        color: #ffd700;
        margin-bottom: 1rem;
        font-size: 1.5rem;
      }

      p {
        color: #999;
        margin-bottom: 1.5rem;
        line-height: 1.6;
      }

      .btn {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        background: #ffd700;
        color: #000;
        text-decoration: none;
        border-radius: 4px;
        font-weight: 500;
        transition: all 0.3s ease;

        &:hover {
          background: #ffed4a;
          transform: translateY(-2px);
        }
      }

      &.discord .card-icon { color: #7289da; }
      &.vk .card-icon { color: #4c75a3; }
      &.reddit .card-icon { color: #ff4500; }
      &.youtube .card-icon { color: #ff0000; }
    }

    .community-features {
      margin-bottom: 4rem;

      h2 {
        text-align: center;
        font-size: 2.5rem;
        margin-bottom: 3rem;
        font-family: 'War Thunder', sans-serif;
      }

      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .feature-card {
        background: rgba(255, 255, 255, 0.05);
        padding: 2rem;
        border-radius: 8px;
        text-align: center;
        transition: transform 0.3s ease;

        &:hover {
          transform: translateY(-5px);
        }

        h3 {
          color: #ffd700;
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }

        p {
          color: #999;
          line-height: 1.6;
        }
      }
    }

    .community-news {
      h2 {
        text-align: center;
        font-size: 2.5rem;
        margin-bottom: 3rem;
        font-family: 'War Thunder', sans-serif;
      }

      .news-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .news-card {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        overflow: hidden;
        transition: transform 0.3s ease;

        &:hover {
          transform: translateY(-5px);
        }

        .news-image {
          height: 200px;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }
        }

        &:hover .news-image img {
          transform: scale(1.1);
        }

        .news-content {
          padding: 1.5rem;

          h3 {
            color: #ffd700;
            margin-bottom: 1rem;
            font-size: 1.2rem;
          }

          p {
            color: #999;
            margin-bottom: 1rem;
            line-height: 1.6;
          }

          .news-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.9rem;

            .news-date {
              color: #666;
            }

            .read-more {
              color: #ffd700;
              text-decoration: none;
              transition: color 0.3s ease;

              &:hover {
                color: #ffed4a;
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