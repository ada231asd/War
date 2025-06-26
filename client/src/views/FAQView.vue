<template>
  <div class="faq-view">
    <section class="faq-header">
      <h1>Часто задаваемые вопросы</h1>
      <p>Найдите ответы на популярные вопросы о ThunderCraft</p>
    </section>

    <section class="faq-content">
      <div class="faq-search">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Поиск по вопросам..."
          @input="filterFAQs"
        >
      </div>

      <div class="faq-categories">
        <button 
          v-for="category in categories" 
          :key="category.id"
          :class="['category-btn', { active: selectedCategory === category.id }]"
          @click="selectCategory(category.id)"
        >
          {{ category.name }}
        </button>
      </div>

      <div class="faq-list">
        <div 
          v-for="faq in filteredFAQs" 
          :key="faq.id" 
          class="faq-item"
          :class="{ 'is-open': faq.isOpen }"
        >
          <div class="faq-question" @click="toggleFAQ(faq)">
            <h3>{{ faq.question }}</h3>
            <span class="toggle-icon">{{ faq.isOpen ? '−' : '+' }}</span>
          </div>
          <div class="faq-answer" v-show="faq.isOpen">
            <p>{{ faq.answer }}</p>
          </div>
        </div>
      </div>

      <div class="faq-contact">
        <h2>Не нашли ответ на свой вопрос?</h2>
        <p>Свяжитесь с нами, и мы поможем вам</p>
        <router-link to="/contact" class="btn btn-primary">Связаться с нами</router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const selectedCategory = ref('all')

const categories = [
  { id: 'all', name: 'Все вопросы' },
  { id: 'general', name: 'Общие вопросы' },
  { id: 'sight-editor', name: 'Редактор прицелов' },
  { id: 'skin-editor', name: 'Редактор скинов' },
  { id: 'technical', name: 'Технические вопросы' }
]

const faqs = ref([
  {
    id: 1,
    category: 'general',
    question: 'Что такое ThunderCraft?',
    answer: 'ThunderCraft - это платформа для создания и редактирования прицелов и скинов для War Thunder. Она предоставляет мощные инструменты для кастомизации вашего игрового опыта.',
    isOpen: false
  },
  {
    id: 2,
    category: 'sight-editor',
    question: 'Как использовать редактор прицелов?',
    answer: 'Редактор прицелов позволяет настраивать различные параметры прицела, включая размер, цвет, форму и дополнительные элементы. Вы можете импортировать существующие прицелы и модифицировать их под свои нужды.',
    isOpen: false
  },
  {
    id: 3,
    category: 'skin-editor',
    question: 'Какие форматы изображений поддерживаются в редакторе скинов?',
    answer: 'Редактор скинов поддерживает форматы PNG, JPG и DDS. Рекомендуется использовать PNG для лучшего качества и прозрачности.',
    isOpen: false
  },
  {
    id: 4,
    category: 'technical',
    question: 'Как установить созданные прицелы и скины в игру?',
    answer: 'После создания прицела или скина, вы можете скачать его и поместить в соответствующую папку в директории War Thunder. Подробные инструкции по установке доступны в разделе "Руководства".',
    isOpen: false
  },
  {
    id: 5,
    category: 'general',
    question: 'Бесплатно ли использование ThunderCraft?',
    answer: 'Да, ThunderCraft полностью бесплатен для использования. Все основные функции доступны без ограничений.',
    isOpen: false
  }
])

const filteredFAQs = computed(() => {
  return faqs.value.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = selectedCategory.value === 'all' || faq.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

const filterFAQs = () => {
  // Дополнительная логика фильтрации при необходимости
}

const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId
}

const toggleFAQ = (faq) => {
  faq.isOpen = !faq.isOpen
}
</script>

<style lang="scss">
.faq-view {
  background: #E1E8EC;
  min-height: 100vh;
  .faq-header {
    background: linear-gradient(rgba(202, 213, 220, 0.85), rgba(225, 232, 236, 0.95)), url('../assets/images/faq-header-bg.jpg') center/cover;
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
  .faq-content {
    padding: 4rem 2rem;
    background: #CAD5DC;
    color: #5A6D76;
    max-width: 1200px;
    margin: 0 auto;
    border-radius: 12px;
    box-shadow: 0 2px 16px rgba(90,109,118,0.2);
    .faq-search {
      margin-bottom: 2rem;
      input {
        width: 100%;
        padding: 1rem;
        background: #E1E8EC;
        border: 1px solid #4B9FAF;
        border-radius: 4px;
        color: #5A6D76;
        font-size: 1rem;
        &::placeholder {
          color: #A7B0B8;
        }
        &:focus {
          outline: none;
          border-color: #5BB9B2;
        }
      }
    }
    .faq-categories {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 3rem;
      .category-btn {
        padding: 0.75rem 1.5rem;
        background: #E1E8EC;
        border: 1px solid #CAD5DC;
        border-radius: 4px;
        color: #5A6D76;
        cursor: pointer;
        transition: background 0.3s, color 0.3s, border 0.3s;
        &:hover, &.active {
          background: #5BB9B2;
          color: #fff;
          border-color: #5BB9B2;
        }
      }
    }
    .faq-list {
      .faq-item {
        background: #E1E8EC;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(90,109,118,0.2);
        margin-bottom: 1.5rem;
        transition: background 0.3s, color 0.3s;
        &.is-open {
          background: #CAD5DC;
        }
        .faq-question {
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          padding: 1.2rem 1.5rem;
          h3 {
            color: #4B9FAF;
            font-size: 1.1rem;
            margin: 0;
          }
          .toggle-icon {
            font-size: 1.5rem;
            color: #5BB9B2;
          }
        }
        .faq-answer {
          padding: 1.2rem 1.5rem 1.5rem 1.5rem;
          p {
            color: #5A6D76;
            margin: 0;
          }
        }
      }
    }
    .faq-contact {
      background: #E1E8EC;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(90,109,118,0.2);
      margin-top: 2rem;
      padding: 2rem;
      text-align: center;
      h2 {
        color: #4B9FAF;
        margin-bottom: 1rem;
      }
      p {
        color: #5A6D76;
        margin-bottom: 1.5rem;
      }
      .btn-primary {
        background: #4B9FAF;
        color: #fff;
        border-radius: 4px;
        padding: 1rem 2rem;
        font-weight: 500;
        font-size: 1.1rem;
        border: none;
        box-shadow: 0 2px 8px rgba(90,109,118,0.2);
        transition: background 0.3s, color 0.3s, transform 0.3s;
        &:hover {
          background: #5BB9B2;
          color: #fff;
          transform: translateY(-2px);
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .faq-view {
    .faq-header {
      h1 {
        font-size: 2rem;
      }

      p {
        font-size: 1rem;
      }
    }

    .faq-content {
      .faq-categories {
        .category-btn {
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
        }
      }
    }
  }
}
</style> 