<template>
  <div class="home-view">
    <HeroSection />
    <FeaturesSection />
    <section class="about-section">
      <h2>О проекте ThunderCraft</h2>
      <p>
        ThunderCraft — это платформа для создания и обмена уникальными прицелами и скинами для War Thunder. Мы объединяем творческих игроков и даём им инструменты для самовыражения и обмена опытом. Присоединяйтесь к нашему сообществу, делитесь своими работами и вдохновляйтесь идеями других!
      </p>
    </section>
    <UserReviewsSection />
    <PartnersSection />
    <NewsSection />
  </div>
</template>

<script setup>
import HeroSection from '@/components/Home/HeroSection.vue'
import FeaturesSection from '@/components/Home/FeaturesSection.vue'
import NewsSection from '@/components/Home/NewsSection.vue'
</script>

<style lang="scss">
.home-view {
  background: #E1E8EC;
  min-height: 100vh;
  .about-section {
    background: #CAD5DC;
    color: #5A6D76;
    padding: 3rem 2rem;
    max-width: 900px;
    margin: 0 auto 3rem auto;
    border-radius: 12px;
    box-shadow: 0 2px 16px rgba(90,109,118,0.2);
    h2 {
      font-size: 2rem;
      margin-bottom: 1.5rem;
      text-align: center;
      color: #4B9FAF;
    }
    p {
      font-size: 1.2rem;
      line-height: 1.7;
      text-align: center;
      color: #5A6D76;
    }
  }
}
</style> 