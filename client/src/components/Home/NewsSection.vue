<template>
  <section class="news-section">
    <h2>Новости и обновления</h2>
    <div class="news-list">
      <div class="news-item" v-for="news in newsList" :key="news.title">
        <h3>{{ news.title }}</h3>
        <p class="news-date">{{ news.date }}</p>
        <p>{{ news.text }}</p>
      </div>
    </div>
  </section>
</template>
<script setup>
const newsList = [
  { title: 'Запущен редактор прицелов', date: '21 июня 2024', text: 'Теперь вы можете создавать и настраивать прицелы для War Thunder прямо на нашей платформе!' },
  { title: 'Добавлена поддержка новых скинов', date: '15 июня 2024', text: 'Расширена библиотека скинов и добавлены новые инструменты для их создания.' },
  { title: 'Открытие сообщества ThunderCraft', date: '1 июня 2024', text: 'Присоединяйтесь к нашему сообществу и делитесь своими работами с другими игроками.' }
]
</script>
<style scoped lang="scss">
.news-section {
  background: #CAD5DC;
  color: #5A6D76;
  padding: 3rem 2rem;
  border-radius: 12px;
  max-width: 900px;
  margin: 0 auto 3rem auto;
  box-shadow: 0 2px 16px rgba(90,109,118,0.2);
  h2 {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 2rem;
    color: #4B9FAF;
  }
  .news-list {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    .news-item {
      background: #E1E8EC;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(90,109,118,0.2);
      h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1.2rem;
        color: #4B9FAF;
      }
      .news-date {
        font-size: 0.95rem;
        color: #5BB9B2;
        margin-bottom: 0.5rem;
      }
      p {
        margin: 0;
        color: #5A6D76;
      }
    }
  }
}
</style> 