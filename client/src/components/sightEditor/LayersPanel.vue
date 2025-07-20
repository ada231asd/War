<template>
  <div class="layers-panel">
    <b>Слои</b>
    <div class="layers-list">
      <div v-for="(layer, idx) in layers" :key="layer.id" :class="['layer-row', { selected: selectedLayerId === layer.id, locked: layer.locked }]" @click="selectLayer(layer.id)" :style="{opacity: layer.locked ? 0.6 : 1}">
        <span v-if="editNameId !== layer.id" class="layer-name">{{ layer.name || 'Фото' }}</span>
        <input v-else class="layer-name-edit" v-model="editNameValue" @keyup.enter="applyEditName(layer.id)" @blur="applyEditName(layer.id)" />
        <span class="layer-actions">
          <span class="layer-action" @click.stop="toggleLock(layer.id)">{{ layer.locked ? '🔒' : '🔓' }}</span>
          <span class="layer-action" @click.stop="startEditName(layer)">✏️</span>
          <span class="layer-action" @click.stop="moveLayer(layer.id, -1)" :class="{disabled: idx === 0}">⬆️</span>
          <span class="layer-action" @click.stop="moveLayer(layer.id, 1)" :class="{disabled: idx === layers.length-1}">⬇️</span>
          <span class="layer-action" @click.stop="deleteLayer(layer.id)">🗑️</span>
          <span class="layer-settings" @click.stop="editLayer(layer.id)">⚙️</span>
        </span>
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
  emits: ['select-layer', 'add-layer', 'edit-layer', 'lock-layer', 'delete-layer', 'move-layer', 'edit-layer-name'],
  data() {
    return {
      editNameId: null,
      editNameValue: ''
    };
  },
  methods: {
    selectLayer(id) {
      this.$emit('select-layer', id);
    },
    addLayer() {
      this.$emit('add-layer');
    },
    editLayer(id) {
      this.$emit('edit-layer', id);
    },
    toggleLock(id) {
      this.$emit('lock-layer', id);
    },
    deleteLayer(id) {
      this.$emit('delete-layer', id);
    },
    moveLayer(id, dir) {
      this.$emit('move-layer', {id, dir});
    },
    startEditName(layer) {
      if (layer.locked) return;
      this.editNameId = layer.id;
      this.editNameValue = layer.name;
      this.$nextTick(() => {
        const input = this.$el.querySelector('.layer-name-edit');
        if (input) input.focus();
      });
    },
    applyEditName(id) {
      if (this.editNameValue.trim() !== '') {
        this.$emit('edit-layer-name', {id, name: this.editNameValue.trim()});
      }
      this.editNameId = null;
      this.editNameValue = '';
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
  top: 20%;
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
.layer-row.locked {
  font-style: italic;
  text-decoration: line-through;
}
.layer-name {
  font-weight: bold;
  flex: 1;
  user-select: text;
}
.layer-name-edit {
  flex: 1;
  font-size: 1.1em;
  border-radius: 4px;
  border: 1px solid #ffd700;
  background: #181a20;
  color: #ffd700;
  padding: 0.2em 0.5em;
}
.layer-actions {
  display: flex;
  gap: 0.3em;
  align-items: center;
}
.layer-action {
  font-size: 1.1em;
  cursor: pointer;
  opacity: 0.85;
  transition: opacity 0.2s, color 0.2s;
  color: #ffd700;
  user-select: none;
}
.layer-action.disabled {
  opacity: 0.3;
  pointer-events: none;
}
.layer-action:hover {
  opacity: 1;
  color: #fff;
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