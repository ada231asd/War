<template>
  <section class="community-header">
    <h1>Сообщество</h1>
    <p>Присоединяйтесь к сообществу разработчиков и энтузиастов War Thunder</p>
  </section>
</template>

<script setup>
// Компонент заголовка сообщества
</script>

<style lang="scss" scoped>
.community-header {
  background: linear-gradient(rgba(202, 213, 220, 0.85), rgba(225, 232, 236, 0.95)), url('../../assets/images/community-header-bg.jpg') center/cover;
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

@media (max-width: 768px) {
  .community-header {
    h1 {
      font-size: 2rem;
    }

    p {
      font-size: 1rem;
    }
  }
}
</style> 