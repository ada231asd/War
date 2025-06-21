<template>
  <div class="skin-editor-view">
    <section class="editor-header">
      <h1>Редактор скинов</h1>
      <p>Создавайте уникальные скины для техники в War Thunder</p>
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
            <h3>Настройки скина</h3>
            <div class="setting-group">
              <label>Основной цвет</label>
              <input type="color" v-model="primaryColor" class="color-picker">
            </div>
            <div class="setting-group">
              <label>Вторичный цвет</label>
              <input type="color" v-model="secondaryColor" class="color-picker">
            </div>
            <div class="setting-group">
              <label>Камуфляж</label>
              <select v-model="selectedCamouflage" class="editor-select">
                <option value="none">Нет</option>
                <option value="forest">Лесной</option>
                <option value="desert">Пустынный</option>
                <option value="winter">Зимний</option>
                <option value="naval">Морской</option>
              </select>
            </div>
          </div>

          <div class="sidebar-section">
            <h3>Дополнительные элементы</h3>
            <div class="checkbox-group">
              <label>
                <input type="checkbox" v-model="showDecals">
                Декали
              </label>
            </div>
            <div class="checkbox-group">
              <label>
                <input type="checkbox" v-model="showWeathering">
                Эффекты износа
              </label>
            </div>
            <div class="checkbox-group">
              <label>
                <input type="checkbox" v-model="showMarkings">
                Опознавательные знаки
              </label>
            </div>
          </div>

          <div class="sidebar-actions">
            <button class="btn btn-primary" @click="saveSkin">Сохранить скин</button>
            <button class="btn btn-secondary" @click="exportSkin">Экспорт</button>
          </div>
        </div>

        <div class="editor-preview">
          <div class="preview-container">
            <canvas ref="previewCanvas" class="preview-canvas"></canvas>
          </div>
          <div class="preview-controls">
            <button class="btn btn-icon" @click="rotateLeft">
              <span class="icon">↶</span>
            </button>
            <button class="btn btn-icon" @click="rotateRight">
              <span class="icon">↷</span>
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
const primaryColor = ref('#4a4a4a')
const secondaryColor = ref('#2a2a2a')
const selectedCamouflage = ref('none')
const showDecals = ref(true)
const showWeathering = ref(false)
const showMarkings = ref(true)
const previewCanvas = ref(null)

const rotateLeft = () => {
  // Логика поворота модели влево
}

const rotateRight = () => {
  // Логика поворота модели вправо
}

const resetView = () => {
  // Логика сброса вида
}

const saveSkin = () => {
  // Логика сохранения скина
}

const exportSkin = () => {
  // Логика экспорта скина
}

onMounted(() => {
  // Инициализация canvas и отрисовка модели
})
</script>

<style lang="scss">
.skin-editor-view {
  .editor-header {
    background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)),
                url('../assets/images/skin-editor-bg.jpg') center/cover;
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
  .skin-editor-view {
    .editor-content {
      .editor-container {
        grid-template-columns: 1fr;
      }
    }
  }
}

@media (max-width: 768px) {
  .skin-editor-view {
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