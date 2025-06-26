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

          <div class="sidebar-section">
            <h3>Цвет заливки</h3>
            <div class="setting-group">
              <label>Цвет заливки</label>
              <input type="color" v-model="fillColor" class="color-picker">
            </div>
          </div>

          <div class="sidebar-section">
            <h3>Фон/Изображение</h3>
            <input type="file" @change="onImageUpload" accept="image/*" />
          </div>
        </div>

        <div class="editor-preview">
          <div class="tools-bar">
            <button :class="['tool-btn', {active: selectedTool==='pencil'}]" @click="selectTool('pencil')" title="Карандаш">✏️</button>
            <button :class="['tool-btn', {active: selectedTool==='line'}]" @click="selectTool('line')" title="Линия">/</button>
            <button :class="['tool-btn', {active: selectedTool==='curve'}]" @click="selectTool('curve')" title="Кривая">~</button>
            <button :class="['tool-btn', {active: selectedTool==='rect'}]" @click="selectTool('rect')" title="Прямоугольник">▭</button>
            <button :class="['tool-btn', {active: selectedTool==='circle'}]" @click="selectTool('circle')" title="Круг">◯</button>
            <button :class="['tool-btn', {active: selectedTool==='fill'}]" @click="selectTool('fill')" title="Заливка">🪣</button>
            <button :class="['tool-btn', {active: selectedTool==='select'}]" @click="selectTool('select')" title="Выделение">🖱️</button>
          </div>
          <div class="preview-container">
            <canvas ref="previewCanvas" class="preview-canvas"
              @mousedown="onCanvasMouseDown"
              @mousemove="onCanvasMouseMove"
              @mouseup="onCanvasMouseUp"
              @mouseleave="onCanvasMouseUp"
            ></canvas>
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
        <div class="editor-layers">
          <div class="layers-panel">
            <h3>Слои</h3>
            <button class="btn btn-secondary" @click="addLayer">Добавить слой</button>
            <ul class="layers-list">
              <li v-for="(layer, idx) in layers" :key="layer.id" :class="{active: idx===activeLayerIndex}">
                <span @click="setActiveLayer(idx)">{{ layer.name }}</span>
                <button @click="toggleLayerVisibility(idx)">{{ layer.visible ? '👁' : '🚫' }}</button>
                <button @click="removeLayer(idx)">🗑</button>
                <button v-if="idx>0" @click="moveLayer(idx, -1)">⬆️</button>
                <button v-if="idx<layers.length-1" @click="moveLayer(idx, 1)">⬇️</button>
                <button @click="clearLayer(idx)">🧹</button>
                <div v-if="layer.type==='image'" style="margin-top:4px;">
                  <label style="font-size:0.9em;">Прозрачность: <input type="range" min="0" max="1" step="0.01" v-model.number="layer.opacity" @input="redrawCanvas()" /></label>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

const selectedVehicleType = ref('tank')
const sightColor = ref('#ffd700')
const lineThickness = ref(2)
const opacity = ref(80)
const showDistanceMarkers = ref(true)
const showWindIndicator = ref(false)
const showTargetSize = ref(true)
const previewCanvas = ref(null)
const selectedTool = ref('pencil')
const drawing = ref(false)
const startPoint = ref({x:0, y:0})
const currentPoint = ref({x:0, y:0})
const fillColor = ref('#ffffff')
const layers = ref([
  { id: 1, name: 'Фон', type: 'background', visible: true, data: null },
])
const activeLayerIndex = ref(0)
let layerIdCounter = 2
const tempLayer = ref(null)
let drawingPoints = []
const zoom = ref(1)
const selectedElement = ref(null)
const dragOffset = ref({x:0, y:0})

const zoomIn = () => {
  zoom.value = Math.min(zoom.value + 0.1, 3)
  applyZoom()
}

const zoomOut = () => {
  zoom.value = Math.max(zoom.value - 0.1, 0.3)
  applyZoom()
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

function selectTool(tool) {
  selectedTool.value = tool
}

function getCanvasPos(e) {
  const rect = previewCanvas.value.getBoundingClientRect()
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }
}

function drawOnLayer(ctx, tool, from, to, color, thickness, fill) {
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = thickness
  ctx.fillStyle = fill
  ctx.globalAlpha = opacity.value / 100
  if (tool === 'pencil') {
    ctx.beginPath()
    ctx.moveTo(from[0].x, from[0].y)
    for (let i = 1; i < from.length; i++) ctx.lineTo(from[i].x, from[i].y)
    ctx.stroke()
  } else if (tool === 'line') {
    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.stroke()
  } else if (tool === 'rect') {
    const w = to.x - from.x, h = to.y - from.y
    ctx.beginPath()
    ctx.rect(from.x, from.y, w, h)
    if (fillColor.value && selectedTool.value==='fill') ctx.fill()
    ctx.stroke()
  } else if (tool === 'circle') {
    const r = Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2))
    ctx.beginPath()
    ctx.arc(from.x, from.y, r, 0, 2 * Math.PI)
    if (fillColor.value && selectedTool.value==='fill') ctx.fill()
    ctx.stroke()
  } else if (tool === 'curve') {
    ctx.beginPath()
    ctx.moveTo(from[0].x, from[0].y)
    ctx.quadraticCurveTo(from[1].x, from[1].y, from[2].x, from[2].y)
    ctx.stroke()
  }
  ctx.restore()
}

function onCanvasMouseDown(e) {
  drawing.value = true
  startPoint.value = getCanvasPos(e)
  currentPoint.value = getCanvasPos(e)
  if (selectedTool.value === 'pencil') {
    drawingPoints = [startPoint.value]
  } else if (selectedTool.value === 'curve') {
    drawingPoints = [startPoint.value]
  } else if (selectedTool.value === 'select') {
    const layer = layers.value[activeLayerIndex.value]
    if (layer && layer.draw) {
      for (let i = layer.draw.length - 1; i >= 0; i--) {
        const el = layer.draw[i]
        if (isPointOnElement(currentPoint.value, el)) {
          selectedElement.value = {el, idx: i}
          dragOffset.value = {x: currentPoint.value.x - (el.from?.x || el.points?.[0]?.x || 0), y: currentPoint.value.y - (el.from?.y || el.points?.[0]?.y || 0)}
          break
        }
      }
    }
    drawing.value = false
  } else if (selectedTool.value === 'fill') {
    const layer = layers.value[activeLayerIndex.value]
    if (layer.type === 'background') {
      layer.data = { fill: fillColor.value }
      redrawCanvas()
    }
    drawing.value = false
  }
  const layer = layers.value[activeLayerIndex.value]
  if (layer && layer.type==='image') {
    if (!layer.position) layer.position = {x:0, y:0}
    if (!layer.opacity) layer.opacity = 1
    if (isPointOnImage(currentPoint.value, layer)) {
      selectedElement.value = {el: layer, idx: activeLayerIndex.value, type:'image'}
      dragOffset.value = {x: currentPoint.value.x - layer.position.x, y: currentPoint.value.y - layer.position.y}
      drawing.value = true
    }
  }
}

function onCanvasMouseMove(e) {
  if (!drawing.value) return
  currentPoint.value = getCanvasPos(e)
  if (selectedTool.value === 'pencil') {
    drawingPoints.push(currentPoint.value)
    drawTemp()
  } else if (selectedTool.value === 'curve') {
    if (drawingPoints.length < 3) drawingPoints.push(currentPoint.value)
    drawTemp()
  } else if (['line','rect','circle'].includes(selectedTool.value)) {
    drawTemp()
  } else if (selectedTool.value === 'select' && selectedElement.value) {
    const layer = layers.value[activeLayerIndex.value]
    const el = selectedElement.value.el
    const dx = currentPoint.value.x - dragOffset.value.x
    const dy = currentPoint.value.y - dragOffset.value.y
    if (el.from && el.to) {
      const w = el.to.x - el.from.x, h = el.to.y - el.from.y
      el.from.x = dx; el.from.y = dy
      el.to.x = dx + w; el.to.y = dy + h
    } else if (el.points) {
      const offsetX = dx - el.points[0].x
      const offsetY = dy - el.points[0].y
      el.points = el.points.map(p => ({x: p.x + offsetX, y: p.y + offsetY}))
    }
    redrawCanvas()
  } else if (selectedElement.value && selectedElement.value.type==='image') {
    const layer = layers.value[selectedElement.value.idx]
    layer.position.x = currentPoint.value.x - dragOffset.value.x
    layer.position.y = currentPoint.value.y - dragOffset.value.y
    redrawCanvas()
  }
}

function onCanvasMouseUp(e) {
  if (!drawing.value) return
  drawing.value = false
  currentPoint.value = getCanvasPos(e)
  if (selectedTool.value === 'pencil') {
    commitDraw('pencil', drawingPoints)
  } else if (selectedTool.value === 'curve' && drawingPoints.length === 3) {
    commitDraw('curve', {points: [...drawingPoints]})
  } else if (selectedTool.value === 'line') {
    commitDraw('line', {from: startPoint.value, to: currentPoint.value})
  } else if (selectedTool.value === 'rect') {
    commitDraw('rect', {from: startPoint.value, to: currentPoint.value})
  } else if (selectedTool.value === 'circle') {
    commitDraw('circle', {from: startPoint.value, to: currentPoint.value})
  }
  tempLayer.value = null
  selectedElement.value = null
  redrawCanvas()
}

function drawTemp() {
  const canvas = previewCanvas.value
  if (!canvas) return
  redrawCanvas()
  const ctx = canvas.getContext('2d')
  if (selectedTool.value === 'pencil') {
    drawOnLayer(ctx, 'pencil', drawingPoints, null, sightColor.value, lineThickness.value, fillColor.value)
  } else if (selectedTool.value === 'curve') {
    if (drawingPoints.length === 3) {
      drawOnLayer(ctx, 'curve', drawingPoints, null, sightColor.value, lineThickness.value, fillColor.value)
    }
  } else if (selectedTool.value === 'line') {
    drawOnLayer(ctx, 'line', startPoint.value, currentPoint.value, sightColor.value, lineThickness.value, fillColor.value)
  } else if (selectedTool.value === 'rect') {
    drawOnLayer(ctx, 'rect', startPoint.value, currentPoint.value, sightColor.value, lineThickness.value, fillColor.value)
  } else if (selectedTool.value === 'circle') {
    drawOnLayer(ctx, 'circle', startPoint.value, currentPoint.value, sightColor.value, lineThickness.value, fillColor.value)
  }
}

function commitDraw(tool, data) {
  const layer = layers.value[activeLayerIndex.value]
  if (!layer || layer.type==='image') return
  if (!layer.draw) layer.draw = []
  if (tool === 'pencil') {
    layer.draw.push({tool:'pencil', points:[...data], color:sightColor.value, thickness:lineThickness.value, fill:fillColor.value})
  } else if (tool === 'line') {
    layer.draw.push({tool:'line', from:{...data.from}, to:{...data.to}, color:sightColor.value, thickness:lineThickness.value, fill:fillColor.value})
  } else if (tool === 'rect') {
    layer.draw.push({tool:'rect', from:{...data.from}, to:{...data.to}, color:sightColor.value, thickness:lineThickness.value, fill:fillColor.value})
  } else if (tool === 'circle') {
    layer.draw.push({tool:'circle', from:{...data.from}, to:{...data.to}, color:sightColor.value, thickness:lineThickness.value, fill:fillColor.value})
  } else if (tool === 'curve') {
    layer.draw.push({tool:'curve', points:[...data.points], color:sightColor.value, thickness:lineThickness.value, fill:fillColor.value})
  }
}

function setActiveLayer(idx) { activeLayerIndex.value = idx }
function toggleLayerVisibility(idx) { layers.value[idx].visible = !layers.value[idx].visible }
function removeLayer(idx) { if(layers.value.length>1){ layers.value.splice(idx,1); if(activeLayerIndex.value>=layers.value.length) activeLayerIndex.value=layers.value.length-1 } }
function moveLayer(idx, dir) {
  const l = layers.value.splice(idx,1)[0]
  layers.value.splice(idx+dir,0,l)
  if(activeLayerIndex.value===idx) activeLayerIndex.value=idx+dir
}

function onImageUpload(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = function(ev) {
    layers.value.push({
      id: layerIdCounter++,
      name: 'Изображение',
      type: 'image',
      visible: true,
      data: ev.target.result
    })
    redrawCanvas()
  }
  reader.readAsDataURL(file)
}

function drawGrid(ctx, w, h, step=40) {
  ctx.save()
  ctx.strokeStyle = 'rgba(90,100,110,0.25)'
  ctx.lineWidth = 1
  for(let x=step;x<w;x+=step){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke() }
  for(let y=step;y<h;y+=step){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke() }
  ctx.restore()
}

function redrawCanvas() {
  const canvas = previewCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0,0,canvas.width,canvas.height)
  ctx.fillStyle = '#fff'
  ctx.fillRect(0,0,canvas.width,canvas.height)
  for(const layer of layers.value) {
    if(!layer.visible) continue
    if(layer.type==='background') {
      if(layer.data && layer.data.fill) {
        ctx.fillStyle = layer.data.fill
        ctx.fillRect(0,0,canvas.width,canvas.height)
      }
      if(layer.draw) for(const d of layer.draw) drawOnLayer(ctx, d.tool, d.points||d.from, d.to, d.color, d.thickness, d.fill)
    } else if(layer.type==='image' && layer.data) {
      const img = new window.Image()
      img.src = layer.data
      ctx.save()
      ctx.globalAlpha = layer.opacity ?? 1
      const pos = layer.position || {x:0, y:0}
      ctx.drawImage(img, pos.x, pos.y, 200, 200)
      ctx.restore()
    }
  }
  drawGrid(ctx, canvas.width, canvas.height)
}

function addLayer() {
  layers.value.push({ id: layerIdCounter++, name: 'Слой ' + layerIdCounter, type: 'background', visible: true, data: null, draw: [] })
}
function clearLayer(idx) {
  if(layers.value[idx].draw) layers.value[idx].draw = []
  if(layers.value[idx].type==='background') layers.value[idx].data = null
  redrawCanvas()
}

function isPointOnElement(point, el) {
  if (el.from && el.to) {
    const minX = Math.min(el.from.x, el.to.x), maxX = Math.max(el.from.x, el.to.x)
    const minY = Math.min(el.from.y, el.to.y), maxY = Math.max(el.from.y, el.to.y)
    return point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY
  } else if (el.points && el.points.length) {
    const p = el.points[0]
    return Math.abs(point.x - p.x) < 10 && Math.abs(point.y - p.y) < 10
  }
  return false
}
function isPointOnImage(point, layer) {
  const x = layer.position?.x || 0, y = layer.position?.y || 0
  return point.x >= x && point.x <= x+200 && point.y >= y && point.y <= y+200
}

function applyZoom() {
  const canvas = previewCanvas.value
  if (!canvas) return
  canvas.style.transform = `scale(${zoom.value})`
  canvas.style.transformOrigin = 'center center'
}

onMounted(() => {
  nextTick(()=>{
    const canvas = previewCanvas.value
    if(canvas) {
      canvas.width = 600
      canvas.height = 600
      redrawCanvas()
      applyZoom()
    }
  })
})
</script>

<style lang="scss">
.sight-editor-view {
  background: #E1E8EC;
  min-height: 100vh;
  .editor-header {
    background: linear-gradient(rgba(202, 213, 220, 0.85), rgba(225, 232, 236, 0.95)), url('../assets/images/sight-editor-bg.jpg') center/cover;
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
      grid-template-columns: 300px 1fr 220px;
      gap: 2rem;
      max-width: 1600px;
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
      .range-slider {
        width: 100%;
        height: 6px;
        -webkit-appearance: none;
        background: #CAD5DC;
        border-radius: 3px;
        outline: none;
        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          background: #5BB9B2;
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
  .editor-preview {
    background: #E1E8EC;
    border-radius: 8px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    box-shadow: 0 2px 8px rgba(90,109,118,0.2);
    .tools-bar {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
      margin-bottom: 1rem;
      .tool-btn {
        background: #CAD5DC;
        border: 2px solid transparent;
        color: #5A6D76;
        font-size: 1.3rem;
        border-radius: 6px;
        padding: 0.5rem 0.7rem;
        cursor: pointer;
        transition: border 0.2s, background 0.2s, color 0.2s;
        &.active {
          border-color: #4B9FAF;
          background: #5BB9B2;
          color: #fff;
        }
        &:hover {
          background: #5BB9B2;
          color: #fff;
        }
      }
    }
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
  .editor-layers {
    background: #E1E8EC;
    border-radius: 8px;
    padding: 1.5rem 1rem;
    min-width: 200px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    box-shadow: 0 2px 8px rgba(90,109,118,0.2);
    .layers-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      h3 {
        color: #4B9FAF;
        margin-bottom: 1rem;
        font-size: 1.2rem;
        text-align: center;
      }
      .layers-list {
        flex: 1;
        overflow-y: auto;
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