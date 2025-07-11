<template>
  <div class="community-grid">
    <CommunityCard
      v-for="card in socialCards"
      :key="card.type"
      :type="card.type"
      :title="card.title"
      :description="card.description"
      :icon-src="card.iconSrc"
      :link="card.link"
      :button-text="card.buttonText"
    />
  </div>
</template>

<script setup>
import CommunityCard from './CommunityCard.vue'

const socialCards = [
  {
    type: 'discord',
    title: 'Discord',
    description: 'Присоединяйтесь к нашему Discord-серверу для общения и обмена опытом',
    iconSrc: '../../assets/images/discord-icon.svg',
    link: '#',
    buttonText: 'Присоединиться'
  },
  {
    type: 'vk',
    title: 'ВКонтакте',
    description: 'Следите за новостями и общайтесь в нашей группе ВКонтакте',
    iconSrc: '../../assets/images/vk-icon.svg',
    link: '#',
    buttonText: 'Подписаться'
  },
  {
    type: 'reddit',
    title: 'Reddit',
    description: 'Участвуйте в обсуждениях на нашем сабреддите',
    iconSrc: '../../assets/images/reddit-icon.svg',
    link: '#',
    buttonText: 'Присоединиться'
  },
  {
    type: 'youtube',
    title: 'YouTube',
    description: 'Смотрите обучающие видео и обзоры на нашем канале',
    iconSrc: '../../assets/images/youtube-icon.svg',
    link: '#',
    buttonText: 'Подписаться'
  }
]
</script>

<style lang="scss" scoped>
.community-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto 4rem;
}
</style> 