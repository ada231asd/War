<template>
  <div class="menuIsland">
    <hr class="menuDragger" size="10px">
    <div class="menu-block">
      <label class="menu-label">URL картинки:</label>
      <input class="menu-input" type="text" v-model="refUrl">
      <button class="menu-btn" @click="loadRefFromUrl">Загрузить</button>
    </div>
    <div class="menu-block">
      <label class="menu-label">Файл картинки:</label>
      <input class="menu-input" type="file" @change="onImageFileChange">
    </div>
    <div class="menu-block">
      <button class="menu-btn" @click="$emit('reset-size')">Вернуть исходный размер</button>
    </div>
    <div class="menu-block">
      <label class="menu-label">Название файла:</label>
      <input class="menu-input" type="text" v-model="saveFileName">
    </div>
    <div class="menu-block menu-btn-row">
      <button class="menu-btn" @click="saveToFile">Сохранить в файл</button>
      <button class="menu-btn" @click="triggerLoadFile">Загрузить из файла</button>
      <input type="file" ref="loadFileInput" style="display: none" @change="onLoadFileChange">
    </div>
    <div class="menu-block menu-autosave">
      <label class="autosave-label">Автосохранение:</label>
      <span class="autosave-toggle" :class="{enabled: autoSaveEnabled}" @click="toggleAutosave">
        <span class="toggle-slider"></span>
      </span>
    </div>
    <div class="menu-block menu-btn-row">
      <button class="menu-btn" @click="exportFile">Экспортировать</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SightEditorMenu',
  props: {
    autoSaveEnabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      refUrl: '',
      saveFileName: 'sight',
    };
  },
  methods: {
    loadRefFromUrl() {
      if (!this.refUrl) return;
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.$emit('image-loaded', img, this.refSize, this.refShiftX, this.refShiftY);
      };
      img.onerror = () => alert('Не удалось загрузить изображение по URL!');
      img.src = this.refUrl;
    },
    onImageFileChange(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new window.Image();
        img.onload = () => {
          this.$emit('image-loaded', img, this.refSize, this.refShiftX, this.refShiftY);
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    },
    saveToFile() {
      this.$emit('save', this.saveFileName);
    },
    triggerLoadFile() {
      this.$refs.loadFileInput.click();
    },
    onLoadFileChange(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        this.$emit('file-loaded', ev.target.result);
      };
      reader.readAsText(file);
    },
    exportFile() {
      this.$emit('export', this.saveFileName);
    },
    toggleAutosave() {
      this.$emit('autosave');
    }
  }
};
</script>

<style scoped>
.menuIsland {
  background: #23272f !important;
  border: 1.5px solid #ffd700;
  position: absolute;
  user-select: none;
  padding: 1.5em 1.5em 1em 1.5em;
  border-radius: 1em;
  z-index: 2;
  color: #f8f8f8;
  font-weight: 500;
  min-width: 320px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.18);
}
.menuDragger {
  margin-bottom: 1em;
}
.menu-block {
  margin-bottom: 1.1em;
  display: flex;
  align-items: center;
  gap: 0.7em;
}
.menu-label {
  min-width: 110px;
  color: #ffd700;
  font-weight: 500;
}
.menu-input[type="text"] {
  flex: 1;
  background: #181a20;
  color: #f8f8f8;
  border: 1.5px solid #ffd700;
  border-radius: 5px;
  padding: 0.4em 0.8em;
  font-size: 1em;
}
.menu-input[type="file"] {
  color: #f8f8f8;
  background: #23272f;
  border: none;
  padding: 0;
}
.menu-btn {
  background: #23272f;
  color: #ffd700;
  border: 1.5px solid #ffd700;
  border-radius: 6px;
  padding: 0.5em 1.2em;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.menu-btn:hover {
  background: #ffd700;
  color: #23272f;
}
.menu-btn-row {
  gap: 0.5em;
}
.menu-autosave {
  align-items: center;
  gap: 0.7em;
}
.autosave-label {
  color: #ffd700;
  font-weight: 500;
}
.autosave-toggle {
  width: 44px;
  height: 24px;
  border-radius: 12px;
  background: #444;
  display: inline-block;
  position: relative;
  cursor: pointer;
  transition: background 0.2s;
  border: 1.5px solid #ffd700;
}
.autosave-toggle.enabled {
  background: #ffd700;
}
.toggle-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  transition: left 0.2s, background 0.2s;
}
.autosave-toggle.enabled .toggle-slider {
  left: 22px;
  background: #23272f;
}
</style> 