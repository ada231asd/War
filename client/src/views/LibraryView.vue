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
  .library-header {
    background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)),
                url('../assets/images/library-header-bg.jpg') center/cover;
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

  .library-content {
    padding: 2rem;
    background: #1a1a1a;
    color: #fff;
    min-height: calc(100vh - 300px);

    .library-filters {
      max-width: 1200px;
      margin: 0 auto 2rem;
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 2rem;

      .search-box {
        grid-column: 1 / -1;

        .search-input {
          width: 100%;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          color: #fff;
          font-size: 1.1rem;

          &:focus {
            outline: none;
            border-color: #ffd700;
          }

          &::placeholder {
            color: rgba(255, 255, 255, 0.5);
          }
        }
      }

      .filter-group {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        padding: 1.5rem;

        h3 {
          color: #ffd700;
          margin-bottom: 1rem;
          font-size: 1.2rem;
        }

        .filter-options {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .filter-option {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #999;
          cursor: pointer;

          input[type="checkbox"] {
            width: 18px;
            height: 18px;
            border: 2px solid #ffd700;
            border-radius: 4px;
            background: transparent;
            cursor: pointer;
          }
        }

        .sort-select {
          width: 100%;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          color: #fff;
          cursor: pointer;

          &:focus {
            outline: none;
            border-color: #ffd700;
          }
        }
      }
    }

    .library-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;

      .library-item {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        overflow: hidden;
        transition: transform 0.3s ease;

        &:hover {
          transform: translateY(-5px);
        }

        .item-preview {
          position: relative;
          height: 200px;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }

          .item-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            flex-direction: column;
            gap: 1rem;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;

            .btn {
              width: 80%;
              padding: 0.75rem;
              border: none;
              border-radius: 4px;
              font-weight: 500;
              cursor: pointer;
              transition: all 0.3s ease;

              &.btn-primary {
                background: #ffd700;
                color: #000;

                &:hover {
                  background: #ffed4a;
                  transform: translateY(-2px);
                }
              }

              &.btn-secondary {
                background: transparent;
                border: 2px solid #ffd700;
                color: #ffd700;

                &:hover {
                  background: rgba(255, 215, 0, 0.1);
                  transform: translateY(-2px);
                }
              }
            }
          }

          &:hover {
            img {
              transform: scale(1.1);
            }

            .item-overlay {
              opacity: 1;
            }
          }
        }

        .item-info {
          padding: 1.5rem;

          h3 {
            color: #ffd700;
            margin-bottom: 0.5rem;
            font-size: 1.2rem;
          }

          .item-description {
            color: #999;
            margin-bottom: 1rem;
            line-height: 1.6;
          }

          .item-meta {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1rem;
            font-size: 0.9rem;
            color: #666;
          }

          .item-stats {
            display: flex;
            gap: 1rem;

            .stat {
              display: flex;
              align-items: center;
              gap: 0.3rem;
              color: #999;

              .icon {
                color: #ffd700;
              }
            }
          }
        }
      }
    }

    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-top: 2rem;

      .btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 4px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;

        &.btn-secondary {
          background: transparent;
          border: 2px solid #ffd700;
          color: #ffd700;

          &:hover:not(:disabled) {
            background: rgba(255, 215, 0, 0.1);
            transform: translateY(-2px);
          }

          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        }
      }

      .page-info {
        color: #999;
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