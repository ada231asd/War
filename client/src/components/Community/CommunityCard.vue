<template>
  <div class="community-card" :class="type">
    <div class="card-icon">
      <img :src="iconSrc" :alt="title">
    </div>
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
    <a :href="link" class="btn btn-primary">{{ buttonText }}</a>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  iconSrc: {
    type: String,
    required: true
  },
  link: {
    type: String,
    default: '#'
  },
  buttonText: {
    type: String,
    required: true
  }
})
</script>

<style lang="scss" scoped>
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
</style> 