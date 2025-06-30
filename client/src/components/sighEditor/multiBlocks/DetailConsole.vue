<template>
  <div
    class="detail-console"
    :class="{ pinned, draggable: !pinned }"
    :style="draggableStyle"
    @mousedown="onDragStart"
  >
    <div class="console-header">
      <h3>Консоль деталей</h3>
      <div class="console-actions">
        <button @click.stop="$emit('clear')" title="Очистить">🧹</button>
        <button @click.stop="$emit('togglePin')" title="Закрепить/Открепить">
          {{ pinned ? '📌' : '🚫' }}
        </button>
      </div>
    </div>
    <ul>
      <li v-for="(action, idx) in actions" :key="idx">{{ action }}</li>
    </ul>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed } from 'vue'
const props = defineProps({
  actions: {
    type: Array,
    default: () => []
  },
  pinned: {
    type: Boolean,
    default: true
  },
  position: {
    type: Object,
    default: () => ({ x: 24, y: 24 })
  }
})
const emit = defineEmits(['clear', 'togglePin', 'update:position'])

const dragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })

const draggableStyle = computed(() => {
  return {
    left: props.position.x + 'px',
    top: props.position.y + 'px',
    position: 'fixed',
    cursor: !props.pinned ? 'move' : 'default',
    zIndex: 1000
  }
})

function onDragStart(e) {
  if (props.pinned) return
  dragging.value = true
  dragOffset.value = {
    x: e.clientX - props.position.x,
    y: e.clientY - props.position.y
  }
  window.addEventListener('mousemove', onDragMove)
  window.addEventListener('mouseup', onDragEnd)
}
function onDragMove(e) {
  if (!dragging.value) return
  emit('update:position', {
    x: e.clientX - dragOffset.value.x,
    y: e.clientY - dragOffset.value.y
  })
}
function onDragEnd() {
  dragging.value = false
  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('mouseup', onDragEnd)
}
</script>

<style scoped>
.detail-console {
  background: #222;
  color: #fff;
  padding: 12px 16px 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  max-width: 320px;
  min-height: 80px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  user-select: none;
}
.console-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.console-actions button {
  background: #444;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 2px 8px;
  margin-left: 6px;
  cursor: pointer;
  font-size: 18px;
  transition: background 0.2s;
}
.console-actions button:hover {
  background: #666;
}
.draggable {
  box-shadow: 0 4px 16px rgba(0,0,0,0.25);
}
.detail-console h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
}
.detail-console ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.detail-console li {
  margin-bottom: 4px;
  word-break: break-all;
}
</style> 