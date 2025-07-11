<template>
  <div class="community-features">
    <h2>Возможности сообщества</h2>
    <div class="features-grid">
      <div 
        v-for="feature in features" 
        :key="feature.title"
        class="feature-card"
      >
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const features = [
  {
    title: 'Обмен опытом',
    description: 'Делитесь своими знаниями и учитесь у других участников сообщества'
  },
  {
    title: 'Совместная работа',
    description: 'Создавайте проекты вместе с другими разработчиками'
  },
  {
    title: 'Конкурсы',
    description: 'Участвуйте в конкурсах и выигрывайте призы'
  },
  {
    title: 'Поддержка',
    description: 'Получайте помощь от опытных участников сообщества'
  }
]
</script>

<style lang="scss" scoped>
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

@media (max-width: 768px) {
  .community-features {
    h2 {
      font-size: 2rem;
    }
  }
}
</style> 