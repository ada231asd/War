<template>
  <div class="library-view">
    <section class="library-header">
      <h1>Библиотека</h1>
      <p>Коллекция прицелов и скинов, созданных сообществом</p>
    </section>

    <section class="library-content">
      <div class="library-filters">
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Поиск прицелов и скинов..."
            class="search-input"
          >
        </div>

        <div class="filter-group">
          <h3>Тип контента</h3>
          <div class="filter-options">
            <label class="filter-option">
              <input type="checkbox" v-model="filters.types.sights">
              Прицелы
            </label>
            <label class="filter-option">
              <input type="checkbox" v-model="filters.types.skins">
              Скины
            </label>
          </div>
        </div>

        <div class="filter-group">
          <h3>Тип техники</h3>
          <div class="filter-options">
            <label class="filter-option">
              <input type="checkbox" v-model="filters.vehicles.tanks">
              Танки
            </label>
            <label class="filter-option">
              <input type="checkbox" v-model="filters.vehicles.aircraft">
              Самолеты
            </label>
            <label class="filter-option">
              <input type="checkbox" v-model="filters.vehicles.helicopters">
              Вертолеты
            </label>
            <label class="filter-option">
              <input type="checkbox" v-model="filters.vehicles.ships">
              Корабли
            </label>
          </div>
        </div>

        <div class="filter-group">
          <h3>Сортировка</h3>
          <select v-model="sortBy" class="sort-select">
            <option value="popular">По популярности</option>
            <option value="newest">По дате</option>
            <option value="rating">По рейтингу</option>
          </select>
        </div>
      </div>

      <div class="library-grid">
        <div class="library-item" v-for="item in filteredItems" :key="item.id">
          <div class="item-preview">
            <img :src="item.preview" :alt="item.title">
            <div class="item-overlay">
              <button class="btn btn-primary" @click="downloadItem(item)">Скачать</button>
              <button class="btn btn-secondary" @click="previewItem(item)">Предпросмотр</button>
            </div>
          </div>
          <div class="item-info">
            <h3>{{ item.title }}</h3>
            <p class="item-description">{{ item.description }}</p>
            <div class="item-meta">
              <span class="item-author">Автор: {{ item.author }}</span>
              <span class="item-date">{{ item.date }}</span>
            </div>
            <div class="item-stats">
              <span class="stat">
                <i class="icon">↓</i>
                {{ item.downloads }}
              </span>
              <span class="stat">
                <i class="icon">★</i>
                {{ item.rating }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="pagination">
        <button 
          class="btn btn-secondary" 
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          Назад
        </button>
        <span class="page-info">Страница {{ currentPage }} из {{ totalPages }}</span>
        <button 
          class="btn btn-secondary" 
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          Вперед
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const currentPage = ref(1)
const totalPages = ref(10)
const sortBy = ref('popular')

const filters = ref({
  types: {
    sights: true,
    skins: true
  },
  vehicles: {
    tanks: true,
    aircraft: true,
    helicopters: true,
    ships: true
  }
})

// Временные данные для демонстрации
const items = ref([
  {
    id: 1,
    title: 'Танковый прицел "Орел"',
    description: 'Точный прицел для средних танков с маркерами дистанции',
    preview: '../assets/images/library/sight-1.jpg',
    author: 'TankMaster',
    date: '15 марта 2024',
    downloads: 1234,
    rating: 4.8,
    type: 'sight',
    vehicle: 'tank'
  },
  {
    id: 2,
    title: 'Скин "Полярный волк"',
    description: 'Зимний камуфляж для истребителей',
    preview: '../assets/images/library/skin-1.jpg',
    author: 'SkyPainter',
    date: '14 марта 2024',
    downloads: 856,
    rating: 4.6,
    type: 'skin',
    vehicle: 'aircraft'
  }
])

const filteredItems = computed(() => {
  return items.value.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesType = (item.type === 'sight' && filters.value.types.sights) ||
                       (item.type === 'skin' && filters.value.types.skins)
    
    const matchesVehicle = (item.vehicle === 'tank' && filters.value.vehicles.tanks) ||
                          (item.vehicle === 'aircraft' && filters.value.vehicles.aircraft) ||
                          (item.vehicle === 'helicopter' && filters.value.vehicles.helicopters) ||
                          (item.vehicle === 'ship' && filters.value.vehicles.ships)
    
    return matchesSearch && matchesType && matchesVehicle
  })
})

const downloadItem = (item) => {
  // Логика скачивания
  console.log('Скачивание:', item.title)
}

const previewItem = (item) => {
  // Логика предпросмотра
  console.log('Предпросмотр:', item.title)
}
</script>

<style lang="scss">
.library-view {
  background: #E1E8EC;
  min-height: 100vh;
  .library-header {
    background: linear-gradient(rgba(202, 213, 220, 0.85), rgba(225, 232, 236, 0.95)), url('../assets/images/library-header-bg.jpg') center/cover;
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
  .library-content {
    padding: 2rem;
    background: #CAD5DC;
    color: #5A6D76;
    min-height: calc(100vh - 300px);
    .library-filters {
      max-width: 1200px;
      margin: 0 auto 2rem;
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 2rem;
      background: #E1E8EC;
      border-radius: 12px;
      box-shadow: 0 2px 16px rgba(90,109,118,0.2);
      padding: 2rem;
      .search-box {
        grid-column: 1 / -1;
        .search-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 4px;
          border: 1px solid #4B9FAF;
          color: #5A6D76;
          background: #CAD5DC;
          font-size: 1rem;
          transition: border 0.3s;
          &:focus {
            outline: none;
            border-color: #5BB9B2;
          }
        }
      }
      .filter-group {
        background: #CAD5DC;
        border-radius: 8px;
        padding: 1rem 1.5rem;
        h3 {
          color: #4B9FAF;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }
        .filter-options {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          .filter-option {
            color: #5A6D76;
            input[type="checkbox"] {
              accent-color: #4B9FAF;
              margin-right: 0.5rem;
            }
          }
        }
        .sort-select {
          width: 100%;
          padding: 0.5rem;
          border-radius: 4px;
          border: 1px solid #4B9FAF;
          color: #5A6D76;
          background: #E1E8EC;
          font-size: 1rem;
          &:focus {
            outline: none;
            border-color: #5BB9B2;
          }
        }
      }
    }
    .library-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2rem;
      .library-item {
        background: #E1E8EC;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(90,109,118,0.2);
        overflow: hidden;
        transition: transform 0.3s, background 0.3s, color 0.3s;
        &:hover {
          transform: translateY(-5px);
          background: #CAD5DC;
        }
        .item-preview {
          position: relative;
          img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 8px 8px 0 0;
          }
          .item-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 1rem;
            background: rgba(75, 159, 175, 0.15);
            opacity: 0;
            transition: opacity 0.3s;
            .btn {
              padding: 0.75rem 1.5rem;
              border-radius: 4px;
              font-weight: 500;
              font-size: 1rem;
              border: none;
              background: #4B9FAF;
              color: #fff;
              transition: background 0.3s, color 0.3s, transform 0.3s;
              &:hover {
                background: #5BB9B2;
                color: #fff;
                transform: translateY(-2px);
              }
            }
            .btn-secondary {
              background: #CAD5DC;
              color: #5A6D76;
              border: 2px solid #4B9FAF;
              &:hover {
                background: #5BB9B2;
                color: #fff;
              }
            }
          }
          &:hover .item-overlay {
            opacity: 1;
          }
        }
        .item-info {
          padding: 1.5rem;
          h3 {
            color: #4B9FAF;
            font-size: 1.2rem;
            margin-bottom: 0.5rem;
          }
          .item-description {
            color: #5A6D76;
            margin-bottom: 1rem;
          }
          .item-meta {
            color: #5A6D76;
            font-size: 0.95rem;
            margin-bottom: 1rem;
            span {
              margin-right: 1rem;
            }
          }
          .item-stats {
            color: #5A6D76;
            font-size: 0.95rem;
            .icon {
              color: #5BB9B2;
              margin-right: 0.3rem;
            }
          }
        }
      }
    }
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2rem;
      margin-top: 2rem;
      .btn-secondary {
        background: #CAD5DC;
        color: #5A6D76;
        border: 2px solid #4B9FAF;
        border-radius: 4px;
        padding: 0.75rem 2rem;
        font-weight: 500;
        font-size: 1rem;
        transition: background 0.3s, color 0.3s;
        &:hover {
          background: #5BB9B2;
          color: #fff;
        }
        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
      .page-info {
        color: #5A6D76;
        font-size: 1rem;
      }
    }
  }
}

@media (max-width: 1024px) {
  .library-view {
    .library-content {
      .library-filters {
        grid-template-columns: 1fr;
      }
    }
  }
}

@media (max-width: 768px) {
  .library-view {
    .library-header {
      h1 {
        font-size: 2rem;
      }

      p {
        font-size: 1rem;
      }
    }
  }
}
</style> 