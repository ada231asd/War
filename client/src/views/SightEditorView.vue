<template>
  <div class="sight-editor-view">
    <section class="editor-header">
      <h1>Редактор прицелов</h1>
      <p>Создавайте и настраивайте прицелы для любой техники в War Thunder</p>
    </section>

    <section class="editor-content">
      <div class="editor-container">
        <div class="editor-sidebar">
          <div class="tools-bar">
            <button class="tool-btn" :class="{active: selectedTool==='pencil'}" @click="selectTool('pencil')" title="Карандаш ({{hotkeys.pencil.key}})">✏️</button>
            <button class="tool-btn" :class="{active: selectedTool==='line'}" @click="selectTool('line')" title="Линия ({{hotkeys.line.key}})">/</button>
            <button class="tool-btn" :class="{active: selectedTool==='curve'}" @click="selectTool('curve')" title="Кривая ({{hotkeys.curve?.key||'Нет'}})">~</button>
            <button class="tool-btn" :class="{active: selectedTool==='rect'}" @click="selectTool('rect')" title="Прямоугольник ({{hotkeys.rect.key}})">▭</button>
            <button class="tool-btn" :class="{active: selectedTool==='circle'}" @click="selectTool('circle')" title="Круг ({{hotkeys.circle.key}})">◯</button>
            <button class="tool-btn" :class="{active: selectedTool==='fill'}" @click="selectTool('fill')" title="Заливка ({{hotkeys.fill.key}})">🪣</button>
            <button class="tool-btn" :class="{active: selectedTool==='select'}" @click="selectTool('select')" title="Выделение ({{hotkeys.select.key}})">🖱️</button>
            <button class="tool-btn" :class="{active: selectedTool==='hand'}" @click="selectTool('hand')" title="Рука">✋</button>
            <button class="tool-btn" :class="{active: selectedTool==='polyline'}" @click="selectTool('polyline')" title="Ломаная/Полигон">⛶</button>
            <button class="tool-btn settings-btn" @click="openHotkeyModal" title="Горячие клавиши">⚙️</button>
          </div>
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
            <h3>Цвет линии</h3>
            <div class="setting-group color-btn-group">
              <button :class="['color-btn', {active: sightColor==='#000000'}]" @click="sightColor='#000000'" title="Чёрный">■</button>
              <button :class="['color-btn', {active: sightColor==='#ffffff'}]" @click="sightColor='#ffffff'" title="Белый" style="color:#fff;background:#444;">□</button>
            </div>
          </div>
          <div class="sidebar-section">
            <h3>Толщина</h3>
            <div class="setting-group slider-row">
              <label class="slider-label">Толщина:</label>
              <input type="number" v-model.number="lineThickness" min="1" max="20" class="slider-input" />
              <span class="slider-unit">px</span>
            </div>
          </div>
          <div class="sidebar-section">
            <h3>Прозрачность</h3>
            <div class="setting-group slider-row">
              <label class="slider-label">Прозрачность:</label>
              <input type="number" v-model.number="opacity" min="0" max="100" class="slider-input" />
              <span class="slider-unit">%</span>
            </div>
          </div>
          <div class="sidebar-section">
            <h3>Фон/Изображение</h3>
            <input type="file" @change="onImageUpload" accept="image/*" />
          </div>
          <div class="sidebar-section">
            <h3>Холст и сетка</h3>
            <div class="setting-group color-btn-group">
              <button :class="['color-btn', {active: canvasBg==='#fff'}]" @click="setCanvasBg('#fff')" title="Белый холст">■</button>
              <button :class="['color-btn', {active: canvasBg==='#000'}]" @click="setCanvasBg('#000')" title="Чёрный холст" style="color:#fff;background:#444;">□</button>
            </div>
            <div class="setting-group">
              <span style="color:#bbb;font-size:0.97em;">Цвет сетки: <span :style="{color: gridColor}">{{ gridColor==='#fff' ? 'белая' : 'чёрная' }}</span></span>
            </div>
          </div>
        </div>

        <div class="editor-preview">
          <canvas ref="previewCanvas" class="preview-canvas"
            @mousedown="onCanvasMouseDown"
            @mousemove="onCanvasMouseMove"
            @mouseup="onCanvasMouseUp"
            @mouseleave="onCanvasMouseUp"
            @dblclick="onCanvasDblClick"
          ></canvas>
          <div class="preview-controls">
            <button class="btn btn-icon" @click="zoomIn" title="Приблизить ({{hotkeys.zoomIn.key}})">
              <span class="icon">+</span>
            </button>
            <button class="btn btn-icon" @click="zoomOut" title="Отдалить ({{hotkeys.zoomOut.key}})">
              <span class="icon">-</span>
            </button>
            <span class="zoom-indicator">{{ Math.round(zoom*100) }}%</span>
            <button class="btn btn-icon" @click="resetView" title="Сбросить масштаб ({{hotkeys.resetView.key}})">
              <span class="icon">↺</span>
            </button>
            <button class="btn btn-icon" @click="rotateActiveLayer" title="Повернуть">
              <span class="icon">⟳</span>
            </button>
            <button class="btn btn-icon" @click="undo" title="Отменить (Ctrl+Z)">⎌</button>
            <button class="btn btn-icon" @click="redo" title="Повторить (Ctrl+Y)">↻</button>
          </div>
        </div>
        <div class="editor-layers">
          <div class="layers-panel">
            <h3>Слои</h3>
            <button class="btn btn-secondary" @click="addLayer">Добавить слой</button>
            <button class="btn btn-secondary" @click="groupSelectedLayers" :disabled="selectedLayers.length<2">Группировать</button>
            <ul class="layers-list">
              <li v-for="(layer, idx) in layers" :key="layer.id" :class="[{active: idx===activeLayerIndex}, {locked: layer.locked}, {group: layer.type==='group'}, {selected: selectedLayers.includes(layer.id)}]" @click="setActiveLayer(idx)">
                <input type="checkbox" v-model="selectedLayers" :value="layer.id" @click.stop />
                <span v-if="layer.type==='group'">🗂️ {{ layer.name }}</span>
                <span v-else>{{ layer.name }}</span>
                <button @click.stop="toggleLayerVisibility(idx)">{{ layer.visible ? '👁' : '🚫' }}</button>
                <button @click.stop="toggleLayerLock(idx)">{{ layer.locked ? '🔒' : '🔓' }}</button>
                <button @click.stop="removeLayer(idx)" :disabled="layer.locked">🗑</button>
                <button v-if="idx>0" @click.stop="moveLayer(idx, -1)" :disabled="layer.locked">⬆️</button>
                <button v-if="idx<layers.length-1" @click.stop="moveLayer(idx, 1)" :disabled="layer.locked">⬇️</button>
                <button @click.stop="clearLayer(idx)" :disabled="layer.locked">🧹</button>
                <button v-if="layer.type==='group'" @click.stop="ungroupLayer(idx)">Разгруппировать</button>
                <div v-if="layer.type==='image'" style="margin-top:4px;">
                  <label style="font-size:0.9em;">Прозрачность: <input type="range" min="0" max="1" step="0.01" v-model.number="layer.opacity" @input="redrawCanvas()" :disabled="layer.locked" /></label>
                </div>
                <ul v-if="layer.type==='group'">
                  <li v-for="sublayer in layer.layers" :key="sublayer.id" style="margin-left:1em;opacity:0.7;list-style:circle;">{{ sublayer.name }}</li>
                </ul>
              </li>
            </ul>
          </div>
          <div class="layer-properties" v-if="activeLayer">
            <h4>Свойства</h4>
            <div class="prop-row"><span>Имя:</span> <input v-model="activeLayer.name" class="prop-input" /></div>
            <div class="prop-row"><span>Тип:</span> <span>{{ activeLayer.type }}</span></div>
            <div class="prop-row" v-if="activeLayer.draw && activeLayer.draw[0] && activeLayer.draw[0].color"><span>Цвет:</span>
              <select v-model="activeLayer.draw[0].color" class="prop-input">
                <option value="#000000">Чёрный</option>
                <option value="#ffffff">Белый</option>
              </select>
            </div>
            <div class="prop-row" v-if="activeLayer.draw && activeLayer.draw[0] && activeLayer.draw[0].thickness"><span>Толщина:</span>
              <input type="number" min="1" max="5" v-model.number="activeLayer.draw[0].thickness" class="prop-input" />
            </div>
            <div class="prop-row" v-if="typeof activeLayer.angle === 'number'"><span>Угол:</span>
              <input type="number" v-model.number="activeLayer.angle" class="prop-input" />
            </div>
            <div class="prop-row" v-if="activeLayer.draw && activeLayer.draw[0] && activeLayer.draw[0].points"><span>Координаты:</span>
              <span>{{ activeLayer.draw[0].points[0]?.x }}, {{ activeLayer.draw[0].points[0]?.y }}</span>
            </div>
            <div class="prop-row" v-if="activeLayer.draw && activeLayer.draw[0] && activeLayer.draw[0].from && activeLayer.draw[0].to"><span>Координаты:</span>
              <span>{{ activeLayer.draw[0].from.x }}, {{ activeLayer.draw[0].from.y }} — {{ activeLayer.draw[0].to.x }}, {{ activeLayer.draw[0].to.y }}</span>
            </div>
            <div class="prop-row" v-if="activeLayer.draw && activeLayer.draw[0] && activeLayer.draw[0].from && activeLayer.draw[0].to"><span>Размеры:</span>
              <span>{{ Math.abs(activeLayer.draw[0].to.x - activeLayer.draw[0].from.x) }} × {{ Math.abs(activeLayer.draw[0].to.y - activeLayer.draw[0].from.y) }}</span>
            </div>
            <div class="prop-row" v-if="typeof activeLayer.opacity === 'number'"><span>Прозрачность:</span>
              <input type="range" min="0" max="1" step="0.01" v-model.number="activeLayer.opacity" class="prop-input" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  <!-- Модальное окно для горячих клавиш -->
  <div v-if="showHotkeyModal" class="hotkey-modal-overlay" @click.self="closeHotkeyModal">
    <div class="hotkey-modal">
      <h2>Горячие клавиши</h2>
      <table class="hotkey-table">
        <tr v-for="(hotkey, action) in hotkeys" :key="action">
          <td>{{ hotkey.label }}</td>
          <td>
            <button @click="startRebinding(action)">
              {{ hotkey.key || 'Назначить' }}
            </button>
            <span v-if="rebindingAction===action" class="rebinding-hint">Нажмите новую клавишу...</span>
          </td>
        </tr>
      </table>
      <button class="btn" @click="closeHotkeyModal">Закрыть</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'

const selectedVehicleType = ref('tank')
const sightColor = ref('#000000')
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
const layers = ref([
  { id: 1, name: 'Фон', type: 'background', visible: true, data: null },
])
const activeLayerIndex = ref(0)
let layerIdCounter = 1
const tempLayer = ref(null)
let drawingPoints = []
const zoom = ref(1)
const pan = ref({x: 0, y: 0})
const selectedElement = ref(null)
const dragOffset = ref({x:0, y:0})

// Горячие клавиши
const showHotkeyModal = ref(false)
const rebindingAction = ref(null)
const hotkeys = ref({
  zoomIn: { label: 'Приблизить', key: 'Ctrl+Plus' },
  zoomOut: { label: 'Отдалить', key: 'Ctrl+Minus' },
  resetView: { label: 'Сбросить вид', key: 'Ctrl+0' },
  pencil: { label: 'Карандаш', key: 'P' },
  line: { label: 'Линия', key: 'L' },
  rect: { label: 'Прямоугольник', key: 'R' },
  circle: { label: 'Круг', key: 'C' },
  fill: { label: 'Заливка', key: 'F' },
  select: { label: 'Выделение', key: 'S' },
})

const selectedLayers = ref([])

// --- История действий ---
const history = ref([])
const future = ref([])
function pushHistory() {
  history.value.push({
    layers: JSON.parse(JSON.stringify(layers.value)),
    pan: {...pan.value},
    zoom: zoom.value
  })
  if (history.value.length > 50) history.value.shift()
  future.value = []
}
function undo() {
  if (history.value.length === 0) return
  future.value.push({
    layers: JSON.parse(JSON.stringify(layers.value)),
    pan: {...pan.value},
    zoom: zoom.value
  })
  const prev = history.value.pop()
  layers.value = JSON.parse(JSON.stringify(prev.layers))
  pan.value = {...prev.pan}
  zoom.value = prev.zoom
  redrawCanvas()
  applyZoom()
}
function redo() {
  if (future.value.length === 0) return
  history.value.push({
    layers: JSON.parse(JSON.stringify(layers.value)),
    pan: {...pan.value},
    zoom: zoom.value
  })
  const next = future.value.pop()
  layers.value = JSON.parse(JSON.stringify(next.layers))
  pan.value = {...next.pan}
  zoom.value = next.zoom
  redrawCanvas()
  applyZoom()
}

function zoomAt(point, delta) {
  const canvas = previewCanvas.value
  if (!canvas) return
  const oldZoom = zoom.value
  let newZoom = zoom.value + delta
  newZoom = Math.max(0.3, Math.min(3, newZoom))
  if (newZoom === oldZoom) return
  // координаты мыши относительно canvas
  const rect = canvas.getBoundingClientRect()
  const px = (point?.x ?? rect.width/2) - rect.left
  const py = (point?.y ?? rect.height/2) - rect.top
  // Переводим экранные координаты мыши в координаты полотна с учётом pan и zoom
  const canvasX = (px - pan.value.x) / oldZoom
  const canvasY = (py - pan.value.y) / oldZoom
  // Новый pan так, чтобы canvasX, canvasY остались под мышью
  pan.value.x = px - canvasX * newZoom
  pan.value.y = py - canvasY * newZoom
  zoom.value = newZoom
  applyZoom()
}

const zoomIn = (e) => {
  let point = e?.clientX ? {x: e.clientX, y: e.clientY} : undefined
  zoomAt(point, 0.1)
}
const zoomOut = (e) => {
  let point = e?.clientX ? {x: e.clientX, y: e.clientY} : undefined
  zoomAt(point, -0.1)
}

const resetView = () => {
  zoom.value = 1
  pan.value = {x: 0, y: 0}
  applyZoom()
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
    if (fill && fill !== 'transparent') ctx.fill()
    ctx.stroke()
  } else if (tool === 'circle') {
    const r = Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2))
    ctx.beginPath()
    ctx.arc(from.x, from.y, r, 0, 2 * Math.PI)
    if (fill && fill !== 'transparent') ctx.fill()
    ctx.stroke()
  } else if (tool === 'curve') {
    ctx.beginPath()
    ctx.moveTo(from[0].x, from[0].y)
    ctx.quadraticCurveTo(from[1].x, from[1].y, from[2].x, from[2].y)
    ctx.stroke()
  } else if (tool === 'polyline') {
    ctx.beginPath()
    ctx.moveTo(from[0].x, from[0].y)
    for (let i = 1; i < from.length; i++) ctx.lineTo(from[i].x, from[i].y)
    ctx.stroke()
  }
  ctx.restore()
}

let isPanning = false
let lastPanPoint = {x:0, y:0}

let polylinePoints = []
let isDrawingPolyline = false

function onCanvasMouseDown(e) {
  if (selectedTool.value === 'hand') {
    isPanning = true
    lastPanPoint = getCanvasPos(e)
    return
  }
  const layer = layers.value[activeLayerIndex.value]
  if (layer.locked) return
  drawing.value = true
  startPoint.value = getCanvasPos(e)
  currentPoint.value = getCanvasPos(e)
  if (selectedTool.value === 'pencil') {
    drawingPoints = [startPoint.value]
  } else if (selectedTool.value === 'curve') {
    drawingPoints = [startPoint.value]
  } else if (selectedTool.value === 'select') {
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
    if (layer.type === 'background') {
      layer.data = { fill: sightColor.value }
      redrawCanvas()
    }
    drawing.value = false
  } else if (selectedTool.value === 'polyline') {
    const pos = getCanvasPos(e)
    if (!isDrawingPolyline) {
      polylinePoints = [pos]
      isDrawingPolyline = true
    } else {
      // Если клик по первой точке — замыкаем
      const first = polylinePoints[0]
      if (Math.abs(pos.x - first.x) < 10 && Math.abs(pos.y - first.y) < 10 && polylinePoints.length > 2) {
        commitDraw('polyline', {points: [...polylinePoints, first]})
        polylinePoints = []
        isDrawingPolyline = false
        redrawCanvas()
        return
      }
      polylinePoints.push(pos)
    }
    redrawCanvas()
    return
  }
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
  if (selectedTool.value === 'hand' && isPanning) {
    const pos = getCanvasPos(e)
    pan.value.x += pos.x - lastPanPoint.x
    pan.value.y += pos.y - lastPanPoint.y
    lastPanPoint = pos
    applyZoom()
    return
  }
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
  if (selectedTool.value === 'hand') {
    isPanning = false
    return
  }
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
    drawOnLayer(ctx, 'pencil', drawingPoints, null, sightColor.value, lineThickness.value, 'transparent')
  } else if (selectedTool.value === 'curve') {
    if (drawingPoints.length === 3) {
      drawOnLayer(ctx, 'curve', drawingPoints, null, sightColor.value, lineThickness.value, 'transparent')
    }
  } else if (selectedTool.value === 'line') {
    drawOnLayer(ctx, 'line', startPoint.value, currentPoint.value, sightColor.value, lineThickness.value, 'transparent')
  } else if (selectedTool.value === 'rect') {
    drawOnLayer(ctx, 'rect', startPoint.value, currentPoint.value, sightColor.value, lineThickness.value, 'transparent')
  } else if (selectedTool.value === 'circle') {
    drawOnLayer(ctx, 'circle', startPoint.value, currentPoint.value, sightColor.value, lineThickness.value, 'transparent')
  } else if (selectedTool.value === 'polyline' && isDrawingPolyline && polylinePoints.length > 0) {
    ctx.save()
    ctx.strokeStyle = sightColor.value
    ctx.lineWidth = lineThickness.value
    ctx.globalAlpha = opacity.value / 100
    ctx.beginPath()
    ctx.moveTo(polylinePoints[0].x, polylinePoints[0].y)
    for (let i = 1; i < polylinePoints.length; i++) ctx.lineTo(polylinePoints[i].x, polylinePoints[i].y)
    ctx.stroke()
    ctx.restore()
  }
}

function commitDraw(tool, data) {
  pushHistory()
  // Каждый объект — новый слой
  let fill = 'transparent'
  if (tool === 'rect' || tool === 'circle') {
    fill = sightColor.value
  }
  if (tool === 'pencil') {
    layers.value.push({
      id: layerIdCounter++,
      name: getLayerName('pencil'),
      type: 'background',
      visible: true,
      data: null,
      draw: [{tool:'pencil', points:[...data], color:sightColor.value, thickness:lineThickness.value, fill:'transparent'}],
      angle: 0
    })
    activeLayerIndex.value = layers.value.length - 1
  } else if (tool === 'line') {
    layers.value.push({
      id: layerIdCounter++,
      name: getLayerName('line'),
      type: 'background',
      visible: true,
      data: null,
      draw: [{tool:'line', from:{...data.from}, to:{...data.to}, color:sightColor.value, thickness:lineThickness.value, fill:'transparent'}],
      angle: 0
    })
    activeLayerIndex.value = layers.value.length - 1
  } else if (tool === 'rect') {
    layers.value.push({
      id: layerIdCounter++,
      name: getLayerName('rect'),
      type: 'background',
      visible: true,
      data: null,
      draw: [{tool:'rect', from:{...data.from}, to:{...data.to}, color:sightColor.value, thickness:lineThickness.value, fill: fill}],
      angle: 0
    })
    activeLayerIndex.value = layers.value.length - 1
  } else if (tool === 'circle') {
    layers.value.push({
      id: layerIdCounter++,
      name: getLayerName('circle'),
      type: 'background',
      visible: true,
      data: null,
      draw: [{tool:'circle', from:{...data.from}, to:{...data.to}, color:sightColor.value, thickness:lineThickness.value, fill: fill}],
      angle: 0
    })
    activeLayerIndex.value = layers.value.length - 1
  } else if (tool === 'curve') {
    layers.value.push({
      id: layerIdCounter++,
      name: getLayerName('curve'),
      type: 'background',
      visible: true,
      data: null,
      draw: [{tool:'curve', points:[...data.points], color:sightColor.value, thickness:lineThickness.value, fill:'transparent'}],
      angle: 0
    })
    activeLayerIndex.value = layers.value.length - 1
  } else if (tool === 'polyline') {
    layers.value.push({
      id: layerIdCounter++,
      name: getLayerName('polyline'),
      type: 'background',
      visible: true,
      data: null,
      draw: [{tool:'polyline', points:[...data.points], color:sightColor.value, thickness:lineThickness.value, fill:'transparent'}],
      angle: 0
    })
    activeLayerIndex.value = layers.value.length - 1
  }
}

function setActiveLayer(idx) { activeLayerIndex.value = idx }
function toggleLayerLock(idx) { layers.value[idx].locked = !layers.value[idx].locked }
function toggleLayerVisibility(idx) { layers.value[idx].visible = !layers.value[idx].visible }
function removeLayer(idx) {
  pushHistory()
  if(layers.value.length>1 && !layers.value[idx].locked){ layers.value.splice(idx,1); if(activeLayerIndex.value>=layers.value.length) activeLayerIndex.value=layers.value.length-1 }
}
function moveLayer(idx, dir) {
  pushHistory()
  if(layers.value[idx].locked) return
  const l = layers.value.splice(idx,1)[0]
  layers.value.splice(idx+dir,0,l)
  if(activeLayerIndex.value===idx) activeLayerIndex.value=idx+dir
}

function onImageUpload(e) {
  pushHistory()
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

const canvasBg = ref('#fff')
const gridColor = ref('#222')
function setCanvasBg(color) {
  canvasBg.value = color
  gridColor.value = (color === '#fff') ? '#222' : '#fff'
  redrawCanvas()
}

function drawGrid(ctx, w, h, step, color='#222') {
  // 20 квадратов по ширине, шаг одинаковый по X и Y
  const cols = 20
  const cell = w / cols
  const rows = Math.floor(h / cell)
  ctx.save()
  // Сетка
  ctx.strokeStyle = color === '#fff' ? 'rgba(255,255,255,0.18)' : 'rgba(34,34,34,0.18)'
  ctx.lineWidth = 1
  for(let x=0;x<=cols;x++) {
    ctx.beginPath(); ctx.moveTo(x*cell,0); ctx.lineTo(x*cell,rows*cell); ctx.stroke()
  }
  for(let y=0;y<=rows;y++) {
    ctx.beginPath(); ctx.moveTo(0,y*cell); ctx.lineTo(w,y*cell); ctx.stroke()
  }
  // Крест по центру
  ctx.strokeStyle = color === '#fff' ? '#fff' : '#111'
  ctx.lineWidth = 2
  // Вертикаль
  ctx.beginPath(); ctx.moveTo(w/2,0); ctx.lineTo(w/2,rows*cell); ctx.stroke()
  // Горизонталь
  ctx.beginPath(); ctx.moveTo(0,h/2); ctx.lineTo(w,h/2); ctx.stroke()
  ctx.restore()
}

function redrawCanvas() {
  const canvas = previewCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0,0,canvas.width,canvas.height)
  ctx.fillStyle = canvasBg.value
  ctx.fillRect(0,0,canvas.width,canvas.height)
  function drawLayer(layer) {
    if(!layer.visible) return
    ctx.save()
    if (layer.angle && layer.angle !== 0) {
      ctx.translate(canvas.width/2, canvas.height/2)
      ctx.rotate((layer.angle * Math.PI) / 180)
      ctx.translate(-canvas.width/2, -canvas.height/2)
    }
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
    } else if(layer.type==='group' && layer.layers) {
      for(const sub of layer.layers) drawLayer(sub)
    }
    ctx.restore()
  }
  for(const layer of layers.value) drawLayer(layer)
  drawGrid(ctx, canvas.width, canvas.height, null, gridColor.value)
}

function addLayer() {
  pushHistory()
  layers.value.push({ id: layerIdCounter++, name: 'Слой ' + layerIdCounter, type: 'background', visible: true, data: null, draw: [] })
}
function clearLayer(idx) {
  pushHistory()
  if(layers.value[idx].locked) return
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
  canvas.style.transform = `scale(${zoom.value}) translate(${pan.value.x/zoom.value}px, ${pan.value.y/zoom.value}px)`
  canvas.style.transformOrigin = '0 0'
}

function openHotkeyModal() { showHotkeyModal.value = true }
function closeHotkeyModal() { showHotkeyModal.value = false; rebindingAction.value = null }
function startRebinding(action) { rebindingAction.value = action }
function onKeydownForHotkey(e) {
  if (!rebindingAction.value) {
    if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === 'z') { undo(); e.preventDefault(); return }
    if (e.ctrlKey && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) { redo(); e.preventDefault(); return }
    // --- переключение инструментов по горячим клавишам ---
    for (const [action, hotkey] of Object.entries(hotkeys.value)) {
      if (hotkey.key) {
        let key = ''
        if (e.ctrlKey) key += 'Ctrl+'
        if (e.altKey) key += 'Alt+'
        if (e.shiftKey) key += 'Shift+'
        key += e.key.length === 1 ? e.key.toUpperCase() : e.key
        if (key === hotkey.key) {
          if (["pencil","line","rect","circle","fill","select","curve"].includes(action)) {
            selectTool(action)
            e.preventDefault()
            return
          }
          if (action === 'zoomIn') { zoomIn(); e.preventDefault(); return }
          if (action === 'zoomOut') { zoomOut(); e.preventDefault(); return }
          if (action === 'resetView') { resetView(); e.preventDefault(); return }
        }
      }
    }
    return
  }
  // --- переназначение горячей клавиши ---
  e.preventDefault()
  let key = ''
  if (e.ctrlKey) key += 'Ctrl+'
  if (e.altKey) key += 'Alt+'
  if (e.shiftKey) key += 'Shift+'
  key += e.key.length === 1 ? e.key.toUpperCase() : e.key
  hotkeys.value[rebindingAction.value].key = key
  rebindingAction.value = null
}

function rotateActiveLayer() {
  pushHistory()
  const layer = layers.value[activeLayerIndex.value]
  if (!layer || layer.locked) return
  layer.angle = ((layer.angle || 0) + 15) % 360
  redrawCanvas()
}

function getLayerName(type) {
  let base = 'Слой'
  if (type === 'pencil') base = 'Штрих'
  if (type === 'line') base = 'Линия'
  if (type === 'rect') base = 'Прямоугольник'
  if (type === 'circle') base = 'Круг'
  if (type === 'curve') base = 'Кривая'
  if (type === 'polyline') base = 'Ломаная'
  return `${base} ${layerIdCounter}`
}

function groupSelectedLayers() {
  pushHistory()
  if (selectedLayers.value.length < 2) return
  // Собираем выбранные слои
  const groupLayers = layers.value.filter(l => selectedLayers.value.includes(l.id))
  // Удаляем их из layers
  layers.value = layers.value.filter(l => !selectedLayers.value.includes(l.id))
  // Вставляем группу на место первого выбранного слоя
  const firstIdx = Math.min(...selectedLayers.value.map(id => layers.value.findIndex(l => l.id === id)).filter(i => i >= 0))
  const group = {
    id: layerIdCounter++,
    name: 'Группа ' + (layerIdCounter-1),
    type: 'group',
    visible: true,
    locked: false,
    layers: groupLayers
  }
  layers.value.splice(firstIdx >= 0 ? firstIdx : 0, 0, group)
  selectedLayers.value = []
  redrawCanvas()
}

function ungroupLayer(idx) {
  pushHistory()
  const group = layers.value[idx]
  if (!group || group.type !== 'group') return
  // Вставляем слои группы на место группы
  layers.value.splice(idx, 1, ...group.layers)
  redrawCanvas()
}

const activeLayer = computed(() => layers.value[activeLayerIndex.value])

function onCanvasDblClick(e) {
  if (selectedTool.value === 'polyline' && isDrawingPolyline && polylinePoints.length > 1) {
    commitDraw('polyline', {points: [...polylinePoints]})
    polylinePoints = []
    isDrawingPolyline = false
    redrawCanvas()
  }
}

onMounted(() => {
  nextTick(()=>{
    const canvas = previewCanvas.value
    if(canvas) {
      canvas.width = 600
      canvas.height = 600
      redrawCanvas()
      applyZoom()
      // wheel zoom
      canvas.addEventListener('wheel', (e) => {
        if (showHotkeyModal.value) return
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault()
          if (e.deltaY < 0) zoomIn(e)
          else zoomOut(e)
        }
      }, { passive: false })
    }
  })
  window.addEventListener('keydown', onKeydownForHotkey)
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
      max-width: 1800px;
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
  }
  .editor-preview {
    background: #E1E8EC;
    border-radius: 8px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .tools-bar {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
      margin-bottom: 1rem;
      .tool-btn {
        background: rgba(255,255,255,0.08);
        border: 2px solid transparent;
        color: #fff;
        font-size: 1.3rem;
        border-radius: 6px;
        padding: 0.5rem 0.7rem;
        cursor: pointer;
        transition: border 0.2s, background 0.2s;
        &.active {
          border-color: #ffd700;
          background: rgba(255,215,0,0.12);
          color: #ffd700;
        }
        &:hover {
          background: rgba(255,255,255,0.18);
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
      .zoom-indicator {
        font-size: 1.1rem;
        color: #ffd700;
        margin-left: 1rem;
        margin-right: 1rem;
      }
    }
  }
  .editor-layers {
    background: #E1E8EC;
    border-radius: 8px;
    padding: 0.7rem 0.5rem;
    min-width: 160px;
    max-width: 220px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    box-shadow: 0 2px 8px rgba(90,109,118,0.2);
    .layers-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      h3 {
        color: #ffd700;
        margin-bottom: 1rem;
        font-size: 1.2rem;
        text-align: center;
      }
      .layers-list {
        flex: 1;
        overflow-y: auto;
        li {
          cursor: pointer;
          font-size: 0.97em;
          padding: 0.2em 0.3em;
          border-radius: 4px;
          margin-bottom: 2px;
          &.active {
            background: #ffd70033;
            color: #ffd700;
          }
          &.locked {
            opacity: 0.6;
            pointer-events: auto;
          }
          button:disabled {
            opacity: 0.4;
            cursor: not-allowed;
          }
        }
      }
    }
    .layer-properties {
      background: #232323;
      border-radius: 8px;
      margin-top: 1rem;
      padding: 1rem 0.7rem 0.7rem 0.7rem;
      color: #fff;
      font-size: 0.98em;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      h4 {
        color: #ffd700;
        font-size: 1.08em;
        margin-bottom: 0.7em;
        text-align: center;
      }
      .prop-row {
        display: flex;
        align-items: center;
        margin-bottom: 0.5em;
        gap: 0.5em;
        span:first-child {
          min-width: 80px;
          color: #bbb;
        }
        .prop-input {
          background: #181818;
          color: #fff;
          border: 1px solid #444;
          border-radius: 4px;
          padding: 0.2em 0.5em;
          font-size: 1em;
          min-width: 60px;
          max-width: 100px;
        }
        input[type="range"].prop-input {
          min-width: 60px;
          max-width: 120px;
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

.hotkey-modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.hotkey-modal {
  background: #222;
  color: #fff;
  padding: 2rem;
  border-radius: 10px;
  min-width: 350px;
  box-shadow: 0 4px 32px rgba(0,0,0,0.3);
}
.hotkey-table {
  width: 100%;
  margin-bottom: 1.5rem;
  td { padding: 0.5rem 0.7rem; }
  button {
    background: #333;
    color: #ffd700;
    border: none;
    border-radius: 4px;
    padding: 0.3rem 0.7rem;
    cursor: pointer;
    &:hover { background: #444; }
  }
}
.rebinding-hint {
  color: #ffd700;
  margin-left: 0.5rem;
}
.settings-btn {
  margin-left: auto;
}
.editor-sidebar, .editor-layers, .editor-preview {
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
}
.range-slider.styled-slider {
  width: 100%;
  height: 7px;
  -webkit-appearance: none;
  background: #444;
  border-radius: 4px;
  outline: none;
  margin-top: 0.2em;
  margin-bottom: 0.2em;
}
.range-slider.styled-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background: #ffd700;
  border-radius: 50%;
  border: 2px solid #fff;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  transition: background 0.2s;
}
.range-slider.styled-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #ffd700;
  border-radius: 50%;
  border: 2px solid #fff;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  transition: background 0.2s;
}
.range-slider.styled-slider::-ms-thumb {
  width: 20px;
  height: 20px;
  background: #ffd700;
  border-radius: 50%;
  border: 2px solid #fff;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  transition: background 0.2s;
}
.range-slider.styled-slider:focus {
  outline: none;
  box-shadow: 0 0 0 2px #ffd70055;
}
.range-slider.styled-slider::-webkit-slider-runnable-track {
  height: 7px;
  background: #ffd700;
  border-radius: 4px;
}
.range-slider.styled-slider::-ms-fill-lower {
  background: #ffd700;
  border-radius: 4px;
}
.range-slider.styled-slider::-ms-fill-upper {
  background: #ffd700;
  border-radius: 4px;
}
.slider-row {
  display: flex;
  align-items: center;
  gap: 0.7em;
  .slider-label {
    min-width: 90px;
    margin-bottom: 0;
  }
  .slider-input {
    width: 60px;
    font-size: 1.1em;
    padding: 0.2em 0.5em;
    border-radius: 4px;
    border: 1.5px solid #444;
    background: #181818;
    color: #fff;
    text-align: right;
  }
  .slider-unit {
    color: #bbb;
    font-size: 1.1em;
    margin-left: 0.2em;
  }
}
</style> 