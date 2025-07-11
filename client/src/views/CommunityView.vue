<template>
  <div class="community-view">
    <CommunityHeader />
    
    <section class="community-content">
      <CommunityGrid />
      <CommunityFeatures />
      <CommunityNews />
    </section>
  </div>
</template>

<script setup>
import CommunityHeader from '../components/Community/CommunityHeader.vue'
import CommunityGrid from '../components/Community/CommunityGrid.vue'
import CommunityFeatures from '../components/Community/CommunityFeatures.vue'
import CommunityNews from '../components/Community/CommunityNews.vue'
</script>

<style lang="scss">
.community-view {
  background: #E1E8EC;
  min-height: 100vh;
  
  .community-content {
    padding: 4rem 2rem;
    background: #CAD5DC;
    color: #5A6D76;
  }
}
</style> 