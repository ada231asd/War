<template>
  <div class="layers-panel">
    <b>Слои</b>
    <div class="layers-list">
      <div v-for="layer in layers" :key="layer.id" :class="['layer-row', { selected: selectedLayerId === layer.id }]" @click="selectLayer(layer.id)">
        <span class="layer-name">{{ layer.name || 'Фото' }}</span>
        <span class="layer-settings" @click.stop="editLayer(layer.id)">⚙️</span>
      </div>
    </div>
    <button @click="addLayer">Добавить слой</button>
  </div>
</template>

<script>
export default {
  name: 'LayersPanel',
  props: {
    layers: Array,
    selectedLayerId: String
  },
  emits: ['select-layer', 'add-layer', 'edit-layer'],
  methods: {
    selectLayer(id) {
      this.$emit('select-layer', id);
    },
    addLayer() {
      this.$emit('add-layer');
    },
    editLayer(id) {
      this.$emit('edit-layer', id);
    }
  }
};
</script>

<style scoped>
.layers-panel {
  background: #23272f;
  border: 1px solid #444;
  border-radius: 1em;
  padding: 1em;
  min-width: 200px;
  max-height: 70vh;
  overflow-y: auto;
  position: relative;
  z-index: 10;
  box-shadow: 0 2px 16px rgba(0,0,0,0.25);
  color: #f8f8f8;
}
.layers-list {
  margin: 1em 0;
}
.layer-row {
  background: transparent;
  border-radius: 8px;
  margin-bottom: 0.5em;
  padding: 0.7em 1em;
  cursor: pointer;
  transition: background 0.2s;
  font-weight: 500;
  font-size: 1.1em;
  display: flex;
  align-items: center;
  position: relative;
  color: #f8f8f8;
}
.layer-row.selected {
  background: #ffe066;
  color: #23272f;
}
.layer-name {
  font-weight: bold;
  flex: 1;
}
.layer-settings {
  margin-left: 0.7em;
  font-size: 1.2em;
  cursor: pointer;
  opacity: 0.85;
  color: #ffd700;
  transition: opacity 0.2s, color 0.2s;
}
.layer-settings:hover {
  opacity: 1;
  color: #fff;
}
button {
  margin-top: 1em;
  padding: 0.5em 1.2em;
  border-radius: 6px;
  border: 1px solid #ffd700;
  background: #23272f;
  color: #ffd700;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
button:hover {
  background: #ffd700;
  color: #23272f;
}
</style> 