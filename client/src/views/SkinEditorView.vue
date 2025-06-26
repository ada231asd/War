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
  background: #E1E8EC;
  min-height: 100vh;
  .editor-header {
    background: linear-gradient(rgba(202, 213, 220, 0.85), rgba(225, 232, 236, 0.95)), url('../assets/images/skin-editor-bg.jpg') center/cover;
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
  .editor-content {
    padding: 2rem;
    background: #CAD5DC;
    color: #5A6D76;
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
    background: #E1E8EC;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(90,109,118,0.2);
    .sidebar-section {
      margin-bottom: 2rem;
      h3 {
        color: #4B9FAF;
        margin-bottom: 1rem;
        font-size: 1.2rem;
      }
    }
    .setting-group {
      margin-bottom: 1rem;
      label {
        display: block;
        margin-bottom: 0.5rem;
        color: #5A6D76;
      }
      .color-picker {
        width: 100%;
        height: 40px;
        border: none;
        border-radius: 4px;
        background: #CAD5DC;
        cursor: pointer;
      }
      .editor-select {
        width: 100%;
        padding: 0.75rem;
        background: #CAD5DC;
        border: 1px solid #4B9FAF;
        border-radius: 4px;
        color: #5A6D76;
        cursor: pointer;
        &:focus {
          outline: none;
          border-color: #5BB9B2;
        }
      }
    }
    .checkbox-group {
      margin-bottom: 0.8rem;
      label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #5A6D76;
        cursor: pointer;
        input[type="checkbox"] {
          width: 18px;
          height: 18px;
          border: 2px solid #4B9FAF;
          border-radius: 4px;
          background: #E1E8EC;
          cursor: pointer;
        }
      }
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
    .btn-secondary {
      background: #CAD5DC;
      color: #5A6D76;
      border: 2px solid #4B9FAF;
      border-radius: 4px;
      padding: 1rem 2rem;
      font-weight: 500;
      font-size: 1.1rem;
      transition: background 0.3s, color 0.3s;
      &:hover {
        background: #5BB9B2;
        color: #fff;
      }
    }
  }
  .editor-preview {
    background: #E1E8EC;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(90,109,118,0.2);
    .preview-container {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
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
        background: #CAD5DC;
        color: #4B9FAF;
        cursor: pointer;
        transition: all 0.3s ease;
        &:hover {
          background: #5BB9B2;
          color: #fff;
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