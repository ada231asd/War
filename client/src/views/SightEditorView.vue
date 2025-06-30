<template>
  <div class="sight-editor-view">
    <canvas ref="canvas" class="editor-canvas"></canvas>
    <DetailConsole
      :actions="actions"
      :pinned="consolePinned"
      :position="consolePosition"
      class="console-pos"
      @clear="handleClearConsole"
      @togglePin="handleTogglePin"
      @update:position="handleUpdatePosition"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import DetailConsole from '@/components/sighEditor/multiBlocks/DetailConsole.vue'
import { useCanvasZoom } from '@/components/sighEditor/useCanvasZoom.js'

const canvas = ref(null)
const {
  scale,
  minScale,
  maxScale,
  baseWidth,
  baseHeight,
  actions,
  lastAction,
  lastActionCount,
  drawGridAndCross,
  onWheel,
  resetZoom
} = useCanvasZoom()

const consolePinned = ref(true)
const CONSOLE_WIDTH = 320
const CONSOLE_MARGIN = 24
const consolePosition = ref({
  x: window.innerWidth - CONSOLE_WIDTH - CONSOLE_MARGIN,
  y: 100
})

function handleClearConsole() {
  actions.value = []
  lastAction.value = null
  lastActionCount.value = 1
}
function handleTogglePin() {
  consolePinned.value = !consolePinned.value
}
function handleUpdatePosition(pos) {
  consolePosition.value = pos
}

onMounted(() => {
  nextTick(() => {
    drawGridAndCross(canvas.value)
    const cvs = canvas.value
    if (cvs) {
      cvs.addEventListener('wheel', (e) => onWheel(e, cvs), { passive: false })
    }
  })
})
</script>

<style scoped>
.sight-editor-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #fff;
  position: relative;
}
.editor-canvas {
  background: #fff;
  border: 1px solid #eee;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  display: block;
}
.console-pos {
  position: absolute;
  right: 24px;
  z-index: 10;
  pointer-events: auto;
}
</style> 