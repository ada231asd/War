<template>
  <div class="menuIsland" style="left: 1em; top: 1em">
    <hr class="menuDragger" size="10px" style="background-color: lightgray">
    <span>URL картинки:</span>: <input type="text" v-model="refUrl">
    <button @click="loadRefFromUrl">Загрузить</button>
    <br>
    <span>Файл картинки:</span>: <input type="file" @change="onImageFileChange">
    <br>
    <br><br>
    <button @click="$emit('reset-size')">Вернуть исходный размер</button>
    <br><br>
    <span>Название файла</span>: <input type="text" v-model="saveFileName"><br>
    <button @click="saveToFile">Сохранить в файл</button>
    <button @click="triggerLoadFile">Загрузить из файла</button>
    <input type="file" ref="loadFileInput" style="display: none" @change="onLoadFileChange">
    <br>
    <button @click="$emit('autosave')">Принудительно автосохранить</button>
    <span style="display:inline-block;width:1em;height:1em;background:#ccc;vertical-align:middle;border-radius:2px;"></span>
    <br><br>
    <button @click="exportFile">Экспортировать</button>
  </div>
</template>

<script>
export default {
  name: 'SightEditorMenu',
  props: {
    // Для взаимодействия с холстом и редактором
    onImageLoaded: Function,
    onFileLoaded: Function,
    onExport: Function,
    onSave: Function,
    onAutosave: Function
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
      this.$emit('export');
    }
  }
};
</script>

<style scoped>
.menuIsland {
  background-color: white;
  border: 1px solid black;
  position: absolute;
  user-select: none;
  padding: 1em;
  border-radius: 1em;
  z-index: 2;
  color: #000;
  font-weight: 500;
}
.menuIsland,
.menuIsland * {
  color: #000 !important;
  text-shadow: none !important;
}
input, button, label, span {
  color: #000 !important;
  font-weight: 500;
  text-shadow: none !important;
}
button {
  background: #fff;
  border: 1px solid #000;
  border-radius: 4px;
  padding: 0.3em 1em;
  cursor: pointer;
  font-weight: 500;
}
button:hover {
  background: #f0f0f0;
}
input[type="text"], input[type="number"] {
  border: 1px solid #000;
  border-radius: 4px;
  padding: 0.2em 0.5em;
  background: #fff;
}
input[type="range"] {
  accent-color: #000;
}
</style> 