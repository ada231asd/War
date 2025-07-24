<template>
  <div class="community-view" style="display:flex;align-items:center;justify-content:center;height:100vh;font-size:2em;color:#ffd700;background:#23272f;flex-direction:column;">
    <h1>Сообщество</h1>
    <p>Страница сообщества находится в разработке.<br>Примерный функционал: обсуждения, новости, конкурсы, поддержка.</p>
    <div style="margin-top:2em;font-size:1.1em;color:#fff;background:#23272f;padding:1.5em 2em;border-radius:1em;box-shadow:0 2px 16px #0008;max-width:600px;text-align:center;">
      <b>Мы сотрудничаем с полком <span style='color:#ffd700;'>KIVOT</span>!</b><br>
      <div style="margin-top:0.7em;">
        <a href="https://discord.gg/K883Dstznr" target="_blank" style="color:#7289da;text-decoration:underline;font-weight:500;">Discord полка KIVOT</a><br>
        <a href="https://t.me/+_ckKwzhPX6w2NWIy" target="_blank" style="color:#229ed9;text-decoration:underline;font-weight:500;">Telegram-канал KIVOT</a><br>
        <a href="https://t.me/+z3AjsTCRgDpkZWNi" target="_blank" style="color:#229ed9;text-decoration:underline;font-weight:500;">Telegram-чат сайта</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommunityView',
};
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