<template>
  <div class="sight-editor-view">
    <section class="editor-header">
      <h1>Редактор прицелов</h1>
      <p>Создавайте и настраивайте прицелы для любой техники в War Thunder</p>
    </section>

    <section class="editor-content">
      <div class="editor-container">
        <div class="editor-sidebar">
          <div class="sidebar-section">
            <h3>Тип техники</h3>
            <select v-model="selectedVehicleType" class="editor-select">
              <option value="tank">Танки</option>
              <option value="aircraft">Самолеты</option>
              <option value="helicopter">Вертолеты</option>
              <option value="ship">Корабли</option>
            </select>
          </div>

          <div class="sidebar-section">
            <h3>Настройки прицела</h3>
            <div class="setting-group">
              <label>Цвет сетки</label>
              <input type="color" v-model="sightColor" class="color-picker">
            </div>
            <div class="setting-group">
              <label>Толщина линий</label>
              <input type="range" v-model="lineThickness" min="1" max="5" class="range-slider">
            </div>
            <div class="setting-group">
              <label>Прозрачность</label>
              <input type="range" v-model="opacity" min="0" max="100" class="range-slider">
            </div>
          </div>

          <div class="sidebar-section">
            <h3>Дополнительные элементы</h3>
            <div class="checkbox-group">
              <label>
                <input type="checkbox" v-model="showDistanceMarkers">
                Маркеры дистанции
              </label>
            </div>
            <div class="checkbox-group">
              <label>
                <input type="checkbox" v-model="showWindIndicator">
                Индикатор ветра
              </label>
            </div>
            <div class="checkbox-group">
              <label>
                <input type="checkbox" v-model="showTargetSize">
                Размер цели
              </label>
            </div>
          </div>

          <div class="sidebar-actions">
            <button class="btn btn-primary" @click="saveSight">Сохранить прицел</button>
            <button class="btn btn-secondary" @click="exportSight">Экспорт</button>
          </div>
        </div>

        <div class="editor-preview">
          <div class="preview-container">
            <canvas ref="previewCanvas" class="preview-canvas"></canvas>
          </div>
          <div class="preview-controls">
            <button class="btn btn-icon" @click="zoomIn">
              <span class="icon">+</span>
            </button>
            <button class="btn btn-icon" @click="zoomOut">
              <span class="icon">-</span>
            </button>
            <button class="btn btn-icon" @click="resetView">
              <span class="icon">↺</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const selectedVehicleType = ref('tank')
const sightColor = ref('#ffd700')
const lineThickness = ref(2)
const opacity = ref(80)
const showDistanceMarkers = ref(true)
const showWindIndicator = ref(false)
const showTargetSize = ref(true)
const previewCanvas = ref(null)

const zoomIn = () => {
  // Логика увеличения масштаба
}

const zoomOut = () => {
  // Логика уменьшения масштаба
}

const resetView = () => {
  // Логика сброса вида
}

const saveSight = () => {
  // Логика сохранения прицела
}

const exportSight = () => {
  // Логика экспорта прицела
}

onMounted(() => {
  // Инициализация canvas и отрисовка прицела
})
</script>

<style lang="scss">
.sight-editor-view {
  .editor-header {
    background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)),
                url('../assets/images/sight-editor-bg.jpg') center/cover;
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

  .editor-content {
    padding: 2rem;
    background: #1a1a1a;
    color: #fff;
    min-height: calc(100vh - 300px);

    .editor-container {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }
  }

  .editor-sidebar {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 1.5rem;

    .sidebar-section {
      margin-bottom: 2rem;

      h3 {
        color: #ffd700;
        margin-bottom: 1rem;
        font-size: 1.2rem;
      }
    }

    .setting-group {
      margin-bottom: 1rem;

      label {
        display: block;
        margin-bottom: 0.5rem;
        color: #999;
      }

      .color-picker {
        width: 100%;
        height: 40px;
        border: none;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.1);
        cursor: pointer;
      }

      .range-slider {
        width: 100%;
        height: 6px;
        -webkit-appearance: none;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
        outline: none;

        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          background: #ffd700;
          border-radius: 50%;
          cursor: pointer;
        }
      }
    }

    .checkbox-group {
      margin-bottom: 0.8rem;

      label {
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
    }

    .editor-select {
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

    .sidebar-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 2rem;

      .btn {
        width: 100%;
        padding: 1rem;
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
  }

  .editor-preview {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .preview-container {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 4px;
      overflow: hidden;

      .preview-canvas {
        max-width: 100%;
        max-height: 100%;
      }
    }

    .preview-controls {
      display: flex;
      gap: 1rem;
      justify-content: center;

      .btn-icon {
        width: 40px;
        height: 40px;
        border: none;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .icon {
          font-size: 1.5rem;
          line-height: 1;
        }
      }
    }
  }
}

@media (max-width: 1024px) {
  .sight-editor-view {
    .editor-content {
      .editor-container {
        grid-template-columns: 1fr;
      }
    }
  }
}

@media (max-width: 768px) {
  .sight-editor-view {
    .editor-header {
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