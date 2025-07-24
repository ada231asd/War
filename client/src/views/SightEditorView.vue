<template>
  <div class="editor-bg" style="display: flex; flex-direction: column; height: 100vh;">
    <div class="editor-area" ref="editorArea" style="flex: 1 1 auto; position: relative; min-height: 0;">
      <!-- Tool panel -->
      <div class="tool-panel">
        <img
          src="@/assets/images/tools/mause.png"
          alt="Выборка"
          class="tool-icon"
          :class="{ active: tool === 'select' }"
          @click="tool = 'select'"
        />
        <img
          src="@/assets/images/tools/line.png"
          alt="Линия"
          class="tool-icon"
          :class="{ active: tool === 'lines' }"
          @click="tool = 'lines'"
        />
        <img
          src="@/assets/images/tools/poligon.png"
          alt="Многоугольник"
          class="tool-icon"
          :class="{ active: tool === 'polygon' }"
          @click="tool = 'polygon'"
        />
      </div>
      <canvas id="mainCanvas" ref="mainCanvas" :width="canvasWidth" :height="1080"></canvas>
      
      <SightEditorMenu
        @image-loaded="onImageLoaded"
        @save="onSaveFile"
        @file-loaded="onFileLoaded"
        @export="onExportFile"
        @autosave="onAutosave"
        @set-opacity="setReferenceOpacity"
        @reset-size="resetSelectedLayerSize"
      />
    
      <LayersPanel
        :layers="layers"
        :selectedLayerId="selectedLayerId"
        :selectedObjectId="selectedObjectId"
        @select-layer="selectLayer"
        @select-object="selectObject"
        @add-layer="addLayer"
        @edit-layer="openLayerSettings"
        @lock-layer="toggleLayerLock"
        @delete-layer="deleteLayer"
        @move-layer="moveLayer"
        @edit-layer-name="editLayerName"
        style="position: fixed; right: 2em; top: 2em;"
      />
      <div id="infoMenu" class="menuIsland" style="right: 1em; bottom: 1em; text-align: center">
        <hr id="infoMenuDragger" size="10px" style="background-color: lightgray">
        <b id="selObjectTitle">Выбранный объект</b>
        <table id="infoTable"></table>
        <button id="infoDeleteButton" style="display: none">Удалить объект</button>
      </div>
      <div id="hints" style="text-align: center; margin: auto; font-size: 0.8em; user-select: none;">
        <span id="hintsText"></span>
      </div>
      <a id="saver"></a>
      <!-- Окно предпросмотра -->
      <div v-if="showPreview" class="modal-overlay">
        <div class="modal-window">
          <h3>Предпросмотр экспорта (.blk)</h3>
          <canvas ref="previewCanvas" width="600" height="400" style="background:#fff; border:1px solid #333;"></canvas>
          <div style="margin-top:1em; text-align:right;">
            <button @click="showPreview=false">Закрыть</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Модальное окно настроек слоя -->
    <div v-if="showLayerSettings" class="modal-overlay">
      <div class="modal-window">
        <h3>Настройки слоя</h3>
        <label>Прозрачность (0-100%):
          <input type="number" v-model.number="layerSettingsOpacity" min="0" max="100" />
        </label>
        <div style="margin-top:1em; text-align:right;">
          <button @click="applyLayerSettings">OK</button>
          <button @click="closeLayerSettings">Отмена</button>
        </div>
      </div>
    </div>
    <button style="position:fixed;top:1em;right:1em;z-index:1001" @click="openPreview">Предпросмотр .blk</button>
  </div>
</template>

<script>
import editorConfig from '../sightEditor/config';
import SightEditorMenu from '../components/sightEditor/SightEditorMenu.vue';
import LayersPanel from '../components/sightEditor/LayersPanel.vue';
import { drawPolygons, drawGhostPolygon, findNearestVertex as findNearestPolyVertex } from '../components/sightEditor/tools/polygonTool.js';
import earcut from 'earcut';

export default {
  name: 'SightEditorView',
  components: { SightEditorMenu, LayersPanel },
  data() {
    return {
      screenPos: { x: 0, y: 0.1 },
      screenZoom: 0.2,
      gridSize: 0.1,
      mousePos: { x: 0, y: 0 },
      mousePosWindow: { x: 0, y: 0 },
      ctx: null,
      canvas: null,
      selectedId: null,
      objects: new Map(),
      tool: 'lines',
      drawing: false,
      snapping: false,
      startPos: null,
      quadPos: [],
      reference: null,
      referenceSize: 1,
      referenceX: 0,
      referenceY: 0,
      referenceOpacity: 0.5,
      hoveredArrowHitbox: null,
      canvasHover: false,
      dragging: false,
      arrowPulling: false,
      posPulled: null,
      canvasDragSensitivity: 2,
      canvasPullSensitivity: 1.5,
      canvasWidth: window.innerWidth,
      lastDragPos: null,
      freeTransform: false,
      isTransforming: false,
      transformStart: null,
      transformMode: null, // 'move' или 'resize'
      layers: [],
      selectedLayerId: null,
      selectedObjectId: null,
      showLayerSettings: false,
      layerSettingsId: null,
      layerSettingsOpacity: 100,
      drawingLine: null, // временная линия (points: [{x, y}, ...])
      isDrawingLine: false, // флаг рисования линии
      isCtrlDown: false, // для поддержки Ctrl
      hoveredVertex: null, // {lineIdx, pointIdx, x, y} если есть подсвеченная вершина
      // --- polygon tool ---
      drawingPolygon: null, // { points: [{x, y}, ...] }
      isDrawingPolygon: false,
      hoveredPolyVertex: null, // {polyIdx, pointIdx, x, y}
      showPreview: false,
      selectedPolygonIdx: null, // индекс выделенного многоугольника
      hoveredSnapVertex: null, // универсальная подсветка вершины
      selectedElement: null, // выбранный элемент для инструмента выборка
    };
  },
  mounted() {
    this.updateCanvasSize();
    window.addEventListener('resize', this.updateCanvasSize);
    this.canvas = this.$refs.mainCanvas;
    this.ctx = this.canvas.getContext('2d');
    this.initialize();
    this.attachCanvasEvents();
    window.addEventListener('wheel', this.onWheel, { passive: false });
    this.render();
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('keydown', this.onDeletePolygon); // для Delete
    window.addEventListener('keydown', this.onDeleteOrInsertSelected);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateCanvasSize);
    window.removeEventListener('wheel', this.onWheel);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('keydown', this.onDeletePolygon);
    window.removeEventListener('keydown', this.onDeleteOrInsertSelected);
  },
  methods: {
    el(id) {
      return document.getElementById(id);
    },
    initialize() {
      const disclaimerWasClosed = localStorage.getItem('wtdraw-disclaimerClosed');
      if (disclaimerWasClosed != null) {
        const disclaimer = document.getElementById('disclaimer');
        if (disclaimer && disclaimer.parentNode) {
          disclaimer.parentNode.removeChild(disclaimer);
        }
      }
    },
    attachCanvasEvents() {
      this.canvas.onpointerover = () => { this.canvasHover = true; };
      this.canvas.onpointerleave = () => { this.canvasHover = false; this.clearDrawing(); };
      this.canvas.oncontextmenu = (e) => { e.preventDefault(); };
      this.canvas.onpointerdown = this.onPointerDown;
      this.canvas.onpointermove = this.onPointerMove;
      this.canvas.onpointerup = this.onPointerUp;
      this.canvas.onclick = this.onCanvasClick;
    },
    render() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawReference();
      this.drawGrid();
      this.drawCrosshair();
      this.drawStuff();
      this.drawArrows();
      this.drawGhost();
      // --- polygons ---
      const polygonsLayer = this.ensurePolygonsLayer();
      drawPolygons(this.ctx, polygonsLayer.polygons, this.screenPos, this.screenZoom, this.canvas.width, this.canvas.height);
      // Подсветка выделенного многоугольника
      if (this.selectedPolygonIdx !== null && polygonsLayer.polygons[this.selectedPolygonIdx]) {
        const poly = polygonsLayer.polygons[this.selectedPolygonIdx];
        this.ctx.save();
        this.ctx.strokeStyle = '#ffd700';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        const first = this.sightToCanvas(poly.points[0]);
        this.ctx.moveTo(first.x, first.y);
        for (let i = 1; i < poly.points.length; i++) {
          const pt = this.sightToCanvas(poly.points[i]);
          this.ctx.lineTo(pt.x, pt.y);
        }
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.restore();
      }
      // Подсветка ближайшей вершины при зажатом Ctrl и наведении (жёлтый кружок)
      if (this.isCtrlDown && this.hoveredSnapVertex) {
        this.ctx.save();
        this.ctx.beginPath();
        const c = this.sightToCanvas(this.hoveredSnapVertex);
        this.ctx.arc(c.x, c.y, 12, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'rgba(255,215,0,0.5)';
        this.ctx.fill();
        this.ctx.restore();
      }
      if (this.tool === 'polygon' && this.isDrawingPolygon && this.drawingPolygon && this.drawingPolygon.points.length > 0) {
        drawGhostPolygon(this.ctx, this.drawingPolygon.points, this.drawingPolygon.ghost, this.screenPos, this.screenZoom, this.canvas.width, this.canvas.height);
        // Подсветка первой вершины строящегося многоугольника
        const c = this.sightToCanvas(this.drawingPolygon.points[0]);
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(c.x, c.y, 10, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'rgba(0,0,0,0.2)';
        this.ctx.fill();
        this.ctx.restore();
      }
      // Подсветка выбранного элемента для инструмента выборка
      if (this.tool === 'select' && this.selectedElement) {
        if (this.selectedElement.type === 'line') {
          const linesLayer = this.layers.find(l => l.name === 'Линии');
          if (linesLayer && linesLayer.lines && linesLayer.lines[this.selectedElement.idx]) {
            const line = linesLayer.lines[this.selectedElement.idx];
            this.ctx.save();
            this.ctx.strokeStyle = '#ffd700';
            this.ctx.lineWidth = 4;
            this.ctx.beginPath();
            const start = this.sightToCanvas(line.points[0]);
            this.ctx.moveTo(start.x, start.y);
            for (let i = 1; i < line.points.length; i++) {
              const pt = this.sightToCanvas(line.points[i]);
              this.ctx.lineTo(pt.x, pt.y);
            }
            this.ctx.stroke();
            this.ctx.restore();
          }
        } else if (this.selectedElement.type === 'polygon') {
          const polygonsLayer = this.ensurePolygonsLayer();
          if (polygonsLayer.polygons && polygonsLayer.polygons[this.selectedElement.idx]) {
            const poly = polygonsLayer.polygons[this.selectedElement.idx];
            this.ctx.save();
            this.ctx.strokeStyle = '#ffd700';
            this.ctx.lineWidth = 4;
            this.ctx.beginPath();
            const first = this.sightToCanvas(poly.points[0]);
            this.ctx.moveTo(first.x, first.y);
            for (let i = 1; i < poly.points.length; i++) {
              const pt = this.sightToCanvas(poly.points[i]);
              this.ctx.lineTo(pt.x, pt.y);
            }
            this.ctx.closePath();
            this.ctx.stroke();
            this.ctx.restore();
          }
        }
      }
      requestAnimationFrame(this.render);
    },
    v2disposSight2v2sight(disposSight) {
      return { x: disposSight.x - this.screenPos.x, y: disposSight.y - this.screenPos.y };
    },
    sight2pixel(sight) {
      return sight * this.screenZoom * 2000;
    },
    v2sight2v2pixel(sight) {
      return { x: sight.x * this.screenZoom * 2000, y: sight.y * this.screenZoom * 2000 };
    },
    v2pixel2v2canvas(pixel) {
      return { x: pixel.x + this.canvas.width / 2, y: pixel.y + this.canvas.height / 2 };
    },
    v2pixel2v2sight(pixel) {
      return { x: pixel.x / this.screenZoom / 2000, y: pixel.y / this.screenZoom / 2000 };
    },
    v2disposSight2v2canvas(disposSight) {
      return this.v2pixel2v2canvas(this.v2sight2v2pixel(this.v2disposSight2v2sight(disposSight)));
    },
    v2canvas2v2pixel(canv) {
      return { x: canv.x - this.canvas.width / 2, y: canv.y - this.canvas.height / 2 };
    },
    v2sight2v2disposSight(sight) {
      return { x: sight.x + this.screenPos.x, y: sight.y + this.screenPos.y };
    },
    v2canvas2v2disposSight(canv) {
      return this.v2sight2v2disposSight(this.v2pixel2v2sight(this.v2canvas2v2pixel(canv)));
    },
    drawCrosshair() {
      const crossSightPos = { x: 0, y: 0 };
      const crossPixelPos = this.v2sight2v2pixel(this.v2disposSight2v2sight(crossSightPos));
      const crossCanvasPos = this.v2pixel2v2canvas(crossPixelPos);
      this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      this.ctx.beginPath();
      this.ctx.moveTo(0, crossCanvasPos.y);
      this.ctx.lineTo(this.canvas.width, crossCanvasPos.y);
      this.ctx.moveTo(crossCanvasPos.x, 0);
      this.ctx.lineTo(crossCanvasPos.x, this.canvas.height);
      this.ctx.closePath();
      this.ctx.stroke();
    },
    drawGrid() {
      this.ctx.lineWidth = 1;
      for (let z = 1; (0.5 * Math.pow(10, z - 1) < this.screenZoom) || (z === 1); z++) {
        const alpha = 0.25 * Math.pow(0.7, z - 1);
        const gridStep = this.gridSize * Math.pow(0.1, z - 1);
        this.ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
        this.ctx.beginPath();
        for (let i = -0.5; i <= 0.5; i += gridStep) {
          const from = this.v2disposSight2v2canvas({ x: -1, y: i });
          const to = this.v2disposSight2v2canvas({ x: 1, y: i });
          this.ctx.moveTo(from.x, from.y);
          this.ctx.lineTo(to.x, to.y);
        }
        for (let j = -1; j <= 1; j += gridStep) {
          const from = this.v2disposSight2v2canvas({ x: j, y: -0.5 });
          const to = this.v2disposSight2v2canvas({ x: j, y: 0.5 });
          this.ctx.moveTo(from.x, from.y);
          this.ctx.lineTo(to.x, to.y);
        }
        this.ctx.closePath();
        this.ctx.stroke();
      }
    },
    drawReference() {
      // Отрисовываем все фото-слои, но зелёная рамка и маркеры — только для выбранного
      for (const layer of this.layers) {
        if (!layer.img) continue;
        const from = this.v2disposSight2v2canvas({ x: -layer.width / 2 + layer.shiftX, y: -layer.height / 2 + layer.shiftY });
        const to = this.v2disposSight2v2canvas({ x: layer.width / 2 + layer.shiftX, y: layer.height / 2 + layer.shiftY });
        this.ctx.globalAlpha = layer.opacity;
        this.ctx.drawImage(layer.img, from.x, from.y, to.x - from.x, to.y - from.y);
        // Зелёная рамка и маркеры только для выбранного слоя
        if (this.selectedLayerId === layer.id) {
          this.ctx.save();
          this.ctx.globalAlpha = 1;
          this.ctx.strokeStyle = '#00c800';
          this.ctx.lineWidth = 4;
          this.ctx.strokeRect(from.x, from.y, to.x - from.x, to.y - from.y);
          // Маркеры трансформации
          const handles = this.getTransformHandles(from, to);
          for (const h of handles) {
            this.ctx.beginPath();
            this.ctx.arc(h.x, h.y, 7, 0, 2 * Math.PI);
            this.ctx.fillStyle = '#fff';
            this.ctx.fill();
            this.ctx.strokeStyle = '#00c800';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
          }
          this.ctx.restore();
        }
      }
      this.ctx.globalAlpha = 1;
    },
    massTransformPoint(point, x, y, r, sx, sy) {
      let newX = point.x;
      let newY = point.y;
      const tempX = newX * Math.cos(r) - newY * Math.sin(r);
      const tempY = newX * Math.sin(r) + newY * Math.cos(r);
      newX = tempX * sx + x;
      newY = tempY * sy + y;
      return { x: newX, y: newY };
    },
    drawStuff() {
      // Всегда рисуем все линии
      const linesLayer = this.layers.find(l => l.name === 'Линии');
      if (linesLayer && linesLayer.lines) {
        this.ctx.save();
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;
        for (const line of linesLayer.lines) {
          if (line.points.length < 2) continue;
          this.ctx.beginPath();
          const start = this.sightToCanvas(line.points[0]);
          this.ctx.moveTo(start.x, start.y);
          for (let i = 1; i < line.points.length; i++) {
            const pt = this.sightToCanvas(line.points[i]);
            this.ctx.lineTo(pt.x, pt.y);
          }
          this.ctx.stroke();
        }
        this.ctx.restore();
      }
      // Всегда рисуем все многоугольники
      const poligonLayer = this.layers.find(l => l.name === 'Многоугольники');
      if (poligonLayer && poligonLayer.poligons) {
        this.ctx.save();
        this.ctx.fillStyle = 'black';
        this.ctx.globalAlpha = 0.7;
        for (const poly of poligonLayer.poligons) {
          if (poly.points.length < 3) continue;
          this.ctx.beginPath();
          const start = this.sightToCanvas(poly.points[0]);
          this.ctx.moveTo(start.x, start.y);
          for (let i = 1; i < poly.points.length; i++) {
            const pt = this.sightToCanvas(poly.points[i]);
            this.ctx.lineTo(pt.x, pt.y);
          }
          this.ctx.closePath();
          this.ctx.fill();
        }
        this.ctx.globalAlpha = 1;
        this.ctx.restore();
      }
      // Призраки и подсветка — только для активного инструмента
      if (this.tool === 'lines') {
        if (this.isDrawingLine && this.drawingLine && this.drawingLine.points.length > 0 && this.drawingLine.ghost) {
          this.ctx.save();
          this.ctx.setLineDash([8, 8]);
          this.ctx.globalAlpha = 0.5;
          this.ctx.strokeStyle = 'black';
          this.ctx.lineWidth = 2;
          const pts = this.drawingLine.points;
          const from = this.sightToCanvas(pts[pts.length - 1]);
          const to = this.sightToCanvas(this.drawingLine.ghost);
          this.ctx.beginPath();
          this.ctx.moveTo(from.x, from.y);
          this.ctx.lineTo(to.x, to.y);
          this.ctx.stroke();
          this.ctx.setLineDash([]);
          this.ctx.globalAlpha = 1;
          this.ctx.restore();
        }
        if (this.hoveredVertex) {
          const c = this.sightToCanvas(this.hoveredVertex);
          this.ctx.save();
          this.ctx.beginPath();
          this.ctx.arc(c.x, c.y, 10, 0, 2 * Math.PI);
          this.ctx.fillStyle = 'rgba(120,120,120,0.4)';
          this.ctx.fill();
          this.ctx.restore();
        }
      }
      if (this.tool === 'poligon') {
        if (this.isDrawingPolygon && this.drawingPolygon && this.drawingPolygon.points.length > 0) {
          const pts = this.drawingPolygon.points;
          // Рисуем все уже добавленные стороны
          this.ctx.save();
          this.ctx.globalAlpha = 1;
          this.ctx.strokeStyle = 'black';
          this.ctx.lineWidth = 2;
          this.ctx.beginPath();
          const start = this.sightToCanvas(pts[0]);
          this.ctx.moveTo(start.x, start.y);
          for (let i = 1; i < pts.length; i++) {
            const pt = this.sightToCanvas(pts[i]);
            this.ctx.lineTo(pt.x, pt.y);
          }
          this.ctx.stroke();
          this.ctx.restore();
          // Пунктиром — текущий сегмент к курсору
          if (this.drawingPolygon.ghost) {
            this.ctx.save();
            this.ctx.setLineDash([8, 8]);
            this.ctx.globalAlpha = 0.5;
            this.ctx.strokeStyle = 'black';
            this.ctx.lineWidth = 2;
            const from = this.sightToCanvas(pts[pts.length - 1]);
            const to = this.sightToCanvas(this.drawingPolygon.ghost);
            this.ctx.beginPath();
            this.ctx.moveTo(from.x, from.y);
            this.ctx.lineTo(to.x, to.y);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
            this.ctx.globalAlpha = 1;
            this.ctx.restore();
          }
        }
        if (this.hoveredPolyVertex) {
          const c = this.sightToCanvas(this.hoveredPolyVertex);
          this.ctx.save();
          this.ctx.beginPath();
          this.ctx.arc(c.x, c.y, 10, 0, 2 * Math.PI);
          this.ctx.fillStyle = 'rgba(120,120,120,0.4)';
          this.ctx.fill();
          this.ctx.restore();
        }
      }
    },
    getArrowSources(object) {
      const arrowSources = [];
      switch (object.type) {
        case 'line':
          arrowSources.push(this.v2disposSight2v2canvas(object.start));
          arrowSources.push(this.v2disposSight2v2canvas(object.end));
          break;
        case 'quad':
          arrowSources.push(this.v2disposSight2v2canvas(object.pos1));
          arrowSources.push(this.v2disposSight2v2canvas(object.pos2));
          arrowSources.push(this.v2disposSight2v2canvas(object.pos3));
          arrowSources.push(this.v2disposSight2v2canvas(object.pos4));
          break;
      }
      return arrowSources;
    },
    getArrowHitboxes() {
      if (this.selectedId == null) return null;
      const object = this.objects.get(this.selectedId);
      const arrowSources = this.getArrowSources(object);
      const arrowHitboxes = [];
      for (const src of arrowSources) {
        arrowHitboxes.push({ x1: src.x + 10, y1: src.y - 10, x2: src.x + 100, y2: src.y + 10 });
        arrowHitboxes.push({ x1: src.x - 10, y1: src.y - 100, x2: src.x + 10, y2: src.y - 10 });
      }
      return arrowHitboxes;
    },
    drawArrows() {
      if (this.selectedId == null) return;
      const object = this.objects.get(this.selectedId);
      this.ctx.globalAlpha = 0.5;
      const arrowSources = this.getArrowSources(object);
      const arrowHitboxes = this.getArrowHitboxes();
      this.hoveredArrowHitbox = null;
      for (let i = 0; i < arrowHitboxes.length; i++) {
        const hitbox = arrowHitboxes[i];
        if (this.mousePosWindow.x > hitbox.x1 && this.mousePosWindow.y > hitbox.y1 && this.mousePosWindow.x < hitbox.x2 && this.mousePosWindow.y < hitbox.y2)
          this.hoveredArrowHitbox = i;
      }
      let hoveredSource = null;
      let hoveredAxis = null;
      if (this.hoveredArrowHitbox != null) {
        hoveredSource = Math.floor(this.hoveredArrowHitbox / 2);
        hoveredAxis = this.hoveredArrowHitbox - (hoveredSource * 2);
      }
      for (let i = 0; i < arrowSources.length; i++) {
        const pos = arrowSources[i];
        this.ctx.lineWidth = 5;
        // x
        this.ctx.strokeStyle = (hoveredSource === i && hoveredAxis === 0) ? 'rgb(128, 0, 0, 1)' : 'rgb(255, 0, 0, 1)';
        this.ctx.beginPath();
        this.ctx.moveTo(pos.x, pos.y);
        this.ctx.lineTo(pos.x + 100, pos.y);
        this.ctx.lineTo(pos.x + 80, pos.y - 10);
        this.ctx.moveTo(pos.x + 100, pos.y);
        this.ctx.lineTo(pos.x + 80, pos.y + 10);
        this.ctx.closePath();
        this.ctx.stroke();
        // y
        this.ctx.strokeStyle = (hoveredSource === i && hoveredAxis === 1) ? 'rgb(0, 128, 0, 1)' : 'rgb(0, 255, 0, 1)';
        this.ctx.beginPath();
        this.ctx.moveTo(pos.x, pos.y);
        this.ctx.lineTo(pos.x, pos.y - 100);
        this.ctx.lineTo(pos.x - 10, pos.y - 80);
        this.ctx.moveTo(pos.x, pos.y - 100);
        this.ctx.lineTo(pos.x + 10, pos.y - 80);
        this.ctx.closePath();
        this.ctx.stroke();
      }
      this.ctx.globalAlpha = 1;
    },
    drawGhost() {
      // Для примера: пустая реализация, т.к. tool, drawing, snapping, quadPos и прочее не реализованы
    },
    onKeyDown(e) {
      if (e.key === 'Control') {
        this.isCtrlDown = true;
      }
      if (e.altKey && (e.key === 'т' || e.key === 'T' || e.key === 'm' || e.key === 'M')) {
        this.freeTransform = true;
      }
    },
    onKeyUp(e) {
      if (e.key === 'Control') {
        this.isCtrlDown = false;
      }
      if (!e.altKey || (e.key === 'т' || e.key === 'T' || e.key === 'm' || e.key === 'M')) {
        this.freeTransform = false;
        this.isTransforming = false;
        this.transformMode = null;
      }
    },
    ensureLinesLayer() {
      let layer = this.layers.find(l => l.name === 'Линии');
      if (!layer) {
        layer = { id: 'linesLayer', name: 'Линии', type: 'lines', lines: [], img: null, width: 1, height: 1, shiftX: 0, shiftY: 0, opacity: 1 };
        this.layers.push(layer);
      }
      this.selectedLayerId = layer.id;
      return layer;
    },
    // Вспомогательная функция: расстояние от точки до отрезка
    pointToSegmentDist(px, py, x1, y1, x2, y2) {
      const A = px - x1;
      const B = py - y1;
      const C = x2 - x1;
      const D = y2 - y1;
      const dot = A * C + B * D;
      const len_sq = C * C + D * D;
      let param = -1;
      if (len_sq !== 0) param = dot / len_sq;
      let xx, yy;
      if (param < 0) { xx = x1; yy = y1; }
      else if (param > 1) { xx = x2; yy = y2; }
      else { xx = x1 + param * C; yy = y1 + param * D; }
      const dx = px - xx;
      const dy = py - yy;
      return Math.sqrt(dx * dx + dy * dy);
    },
    // Вспомогательная функция: точка внутри многоугольника
    pointInPolygon(px, py, points) {
      let inside = false;
      for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const xi = points[i].x, yi = points[i].y;
        const xj = points[j].x, yj = points[j].y;
        const intersect = ((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi + 0.00001) + xi);
        if (intersect) inside = !inside;
      }
      return inside;
    },
    onCanvasClick(e) {
      if (this.tool === 'select') {
        let minDist = 30;
        let foundType = null;
        let foundIdx = null;
        const rect = this.canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        // Линии: ищем ближайший сегмент
        const linesLayer = this.layers.find(l => l.name === 'Линии');
        if (linesLayer && linesLayer.lines) {
          linesLayer.lines.forEach((line, idx) => {
            for (let i = 1; i < line.points.length; i++) {
              const c1 = this.sightToCanvas(line.points[i - 1]);
              const c2 = this.sightToCanvas(line.points[i]);
              const dist = this.pointToSegmentDist(mx, my, c1.x, c1.y, c2.x, c2.y);
              if (dist < minDist) {
                minDist = dist;
                foundType = 'line';
                foundIdx = idx;
              }
            }
          });
        }
        // Многоугольники: если курсор внутри — выбираем, иначе ищем ближайшее ребро
        const polygonsLayer = this.ensurePolygonsLayer();
        polygonsLayer.polygons.forEach((poly, idx) => {
          const screenPoints = poly.points.map(pt => this.sightToCanvas(pt));
          if (this.pointInPolygon(mx, my, screenPoints)) {
            minDist = 0; // приоритет
            foundType = 'polygon';
            foundIdx = idx;
          } else {
            for (let i = 1; i <= screenPoints.length; i++) {
              const c1 = screenPoints[i - 1];
              const c2 = screenPoints[i % screenPoints.length];
              const dist = this.pointToSegmentDist(mx, my, c1.x, c1.y, c2.x, c2.y);
              if (dist < minDist) {
                minDist = dist;
                foundType = 'polygon';
                foundIdx = idx;
              }
            }
          }
        });
        if (foundType) {
          this.selectedElement = { type: foundType, idx: foundIdx };
        } else {
          this.selectedElement = null;
        }
        return;
      }
      // --- Выделение многоугольника по Shift+ЛКМ ---
      if (this.tool === 'polygon' && e.shiftKey) {
        const polygonsLayer = this.ensurePolygonsLayer();
        const rect = this.canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        let minDist = 9999;
        let foundIdx = null;
        polygonsLayer.polygons.forEach((poly, idx) => {
          // Проверяем расстояние до центра масс
          const cx = poly.points.reduce((sum, p) => sum + p.x, 0) / poly.points.length;
          const cy = poly.points.reduce((sum, p) => sum + p.y, 0) / poly.points.length;
          const c = this.sightToCanvas({ x: cx, y: cy });
          const dist = Math.sqrt((mx - c.x) ** 2 + (my - c.y) ** 2);
          if (dist < minDist && dist < 50) { // 50px радиус
            minDist = dist;
            foundIdx = idx;
          }
        });
        this.selectedPolygonIdx = foundIdx;
        return;
      }
      // --- Создание многоугольника с возможностью присоединения к вершинам линий и многоугольников ---
      if (this.tool === 'polygon') {
        const poligonLayer = this.ensurePolygonsLayer();
        const rect = this.canvas.getBoundingClientRect();
        const canvasPt = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        const { x, y } = this.canvasToSight(canvasPt);
        let snapVertex = this.isCtrlDown ? this.hoveredSnapVertex : null;
        const newPoint = snapVertex ? { x: snapVertex.x, y: snapVertex.y } : { x, y };

        if (!this.isDrawingPolygon) {
          this.drawingPolygon = { points: [newPoint] };
          this.isDrawingPolygon = true;
        } else {
          // Проверка на замыкание (клик по первой вершине)
          const firstPoint = this.drawingPolygon.points[0];
          const firstPointCanvas = this.sightToCanvas(firstPoint);
          const distToFirst = Math.sqrt((canvasPt.x - firstPointCanvas.x) ** 2 + (canvasPt.y - firstPointCanvas.y) ** 2);

          if (this.drawingPolygon.points.length >= 3 && distToFirst < 15) {
            // Завершаем и сохраняем полигон
            poligonLayer.polygons.push({ ...this.drawingPolygon });
            this.drawingPolygon = null;
            this.isDrawingPolygon = false;
            return;
          }

          // Проверка на выпуклость
          const potentialPolygon = [...this.drawingPolygon.points, newPoint];
          if (!this.isConvex(potentialPolygon)) {
            alert('Ошибка: можно создавать только правильные выпуклые многоугольники.');
            return;
          }
          this.drawingPolygon.points.push(newPoint);
        }
        return;
      }
      if (this.tool === 'lines') {
        const linesLayer = this.ensureLinesLayer();
        const rect = this.canvas.getBoundingClientRect();
        const canvasPt = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        const { x, y } = this.canvasToSight(canvasPt);
        let snapVertex = this.isCtrlDown ? this.hoveredSnapVertex : null;
        if (this.isCtrlDown && snapVertex) {
          if (this.isDrawingLine) {
            this.drawingLine.points.push({ x: snapVertex.x, y: snapVertex.y });
            linesLayer.lines.push({ ...this.drawingLine });
            this.drawingLine = null;
            this.isDrawingLine = false;
          } else {
            this.drawingLine = { points: [{ x: snapVertex.x, y: snapVertex.y }] };
            this.isDrawingLine = true;
          }
        } else {
          if (!this.isDrawingLine) {
            this.drawingLine = { points: [{ x, y }] };
            this.isDrawingLine = true;
          } else {
            this.drawingLine.points.push({ x, y });
            linesLayer.lines.push({ ...this.drawingLine });
            this.drawingLine = null;
            this.isDrawingLine = false;
          }
        }
        return;
      }
      this.isCtrlDown = false;
      this.hoveredVertex = null;
      this.drawingPolygon = null;
      this.isDrawingPolygon = false;
      this.hoveredPolyVertex = null;
      this.showPreview = false;
    },
    onPointerMove(e) {
      if (this.dragging) {
        const dx = (e.clientX - this.lastDragPos.x) / (this.screenZoom * 2000);
        const dy = (e.clientY - this.lastDragPos.y) / (this.screenZoom * 2000);
        this.screenPos.x -= dx;
        this.screenPos.y -= dy;
        this.lastDragPos = { x: e.clientX, y: e.clientY };
        return;
      }
      // Универсальная подсветка вершины для любого инструмента
      if (this.isCtrlDown) {
        const rect = this.canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        this.hoveredSnapVertex = this.findNearestVertexUniversal(mx, my);
      } else {
        this.hoveredSnapVertex = null;
      }
      // Призрак линии
      if (this.tool === 'lines' && this.isDrawingLine) {
        const rect = this.canvas.getBoundingClientRect();
        const canvasPt = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        const { x, y } = this.canvasToSight(canvasPt);
        if (this.drawingLine) {
          this.drawingLine.ghost = { x, y };
        }
      }
      // Призрак многоугольника
      if (this.tool === 'polygon' && this.isDrawingPolygon && this.drawingPolygon) {
        const rect = this.canvas.getBoundingClientRect();
        const canvasPt = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        const { x, y } = this.canvasToSight(canvasPt);
        this.drawingPolygon.ghost = { x, y };
      }
    },
    onPointerDown(e) {
      if (e.button === 2) { // ПКМ
        this.dragging = true;
        this.lastDragPos = { x: e.clientX, y: e.clientY };
        return;
      }
      if (this.tool === 'lines') return; // для lines используем onCanvasClick
      const rect = this.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      let hit = false;
      // Проверяем все слои сверху вниз (по Z), пропуская заблокированные
      for (let i = this.layers.length - 1; i >= 0; i--) {
        const layer = this.layers[i];
        if (!layer.img || layer.locked) continue;
        const from = this.v2disposSight2v2canvas({ x: -layer.width / 2 + layer.shiftX, y: -layer.height / 2 + layer.shiftY });
        const to = this.v2disposSight2v2canvas({ x: layer.width / 2 + layer.shiftX, y: layer.height / 2 + layer.shiftY });
        const handles = this.getTransformHandles(from, to);
        for (const h of handles) {
          if (mx >= h.x - 8 && mx <= h.x + 8 && my >= h.y - 8 && my <= h.y + 8) {
            this.selectedLayerId = layer.id;
            this.isTransforming = true;
            this.transformMode = h.type;
            this.transformStart = { x: mx, y: my, ...layer };
            hit = true;
            break;
          }
        }
        if (hit) break;
        if (mx >= from.x && mx <= to.x && my >= from.y && my <= to.y) {
          this.selectedLayerId = layer.id;
          this.isTransforming = true;
          this.transformMode = 'move';
          this.transformStart = { x: mx, y: my, ...layer };
          hit = true;
          break;
        }
      }
      if (!hit) {
        this.selectedLayerId = null;
      }
    },
    onPointerUp(e) {
      if (e.button === 2) {
        this.dragging = false;
        return;
      }
      if (this.tool === 'lines') return;
      this.isTransforming = false;
      this.transformMode = null;
    },
    onWheel(e) {
      // Приближение только при зажатом Alt
      if (!this.canvasHover || !e.altKey) return;
      e.preventDefault();
      const zoomIn = e.deltaY < 0;
      if (zoomIn) {
        this.screenZoom *= 1.1;
      } else {
        this.screenZoom /= 1.1;
        if (this.screenZoom <= 0.1) this.screenZoom = 0.1;
      }
      // screenPos не меняем! Масштабирование строго от центра холста.
    },
    clearDrawing() {
      // Для примера: пустая реализация
    },
    updateCanvasSize() {
      this.canvasWidth = window.innerWidth;
      if (this.$refs.editorArea) {
        this.$refs.editorArea.style.width = window.innerWidth + 'px';
        this.$refs.editorArea.style.height = '1080px';
      }
      if (this.$refs.mainCanvas) {
        this.$refs.mainCanvas.width = window.innerWidth;
        this.$refs.mainCanvas.height = 1080;
      }
    },
    onImageLoaded(img, size, shiftX, shiftY) {
      const layerId = 'layer' + (this.layers.length + 1);
      // Вычисляем начальные width/height пропорционально картинке
      const aspect = img.width / img.height;
      const baseHeight = 0.5; // базовая высота в "единицах"
      const baseWidth = baseHeight * aspect;
      const layer = {
        id: layerId,
        name: 'Фото',
        img,
        width: baseWidth,
        height: baseHeight,
        shiftX: shiftX || 0,
        shiftY: shiftY || 0,
        opacity: 1
      };
      this.layers.push(layer);
      this.selectedLayerId = layerId;
      this.reference = img;
      this.referenceSize = size;
      this.referenceX = shiftX;
      this.referenceY = shiftY;
      this.referenceOpacity = 1;
      // Добавляем запись в консоль
      this.consoleLog.push({
        type: 'Фото',
        settings: `id=${layer.id} width=${layer.width} height=${layer.height} opacity=${layer.opacity}`,
        svg: `<image x="0" y="0" width="${layer.width}" height="${layer.height}" href="data:image/png;base64,..." opacity="${layer.opacity}"/>`
      });
    },
    onSaveFile(fileName) {
      // Сохраняем состояние редактора в .txt (JSON)
      const data = {
        layers: this.layers.map(l => ({
          ...l,
          img: undefined // не сохраняем base64, только параметры слоя
        })),
        screenPos: this.screenPos,
        screenZoom: this.screenZoom,
        gridSize: this.gridSize
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = fileName + '.txt';
      a.click();
      URL.revokeObjectURL(a.href);
    },
    async onFileLoaded(fileContent) {
      // Пробуем распарсить как JSON (txt) или SVG
      try {
        if (fileContent.trim().startsWith('<svg')) {
          // SVG: создаём новый слой
          const parser = new DOMParser();
          const svgDoc = parser.parseFromString(fileContent, 'image/svg+xml');
          const svgBlob = new Blob([fileContent], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(svgBlob);
          const img = new window.Image();
          img.onload = () => {
            this.layers.push({
              id: 'layer' + (this.layers.length + 1),
              name: 'SVG',
              img,
              width: 0.5 * (img.width / img.height),
              height: 0.5,
              shiftX: 0,
              shiftY: 0,
              opacity: 1
            });
            URL.revokeObjectURL(url);
          };
          img.src = url;
        } else {
          // TXT: восстанавливаем состояние
          const data = JSON.parse(fileContent);
          this.layers = data.layers.map((l, i) => ({ ...l, img: null }));
          this.screenPos = data.screenPos || { x: 0, y: 0.1 };
          this.screenZoom = data.screenZoom || 0.2;
          this.gridSize = data.gridSize || 0.1;
        }
      } catch (e) {
        alert('Ошибка загрузки файла: ' + e.message);
      }
    },
    onExportFile() {
      // Экспортируем в .blk по формату shiroko_nn.blk
      let blk = '';
      // --- Базовые параметры (можно вынести в отдельный конфиг) ---
      blk += 'crosshairHorVertSize:p2=3, 2\n';
      blk += 'rangefinderProgressBarColor1:c=0, 255, 0, 64\n';
      blk += 'rangefinderProgressBarColor2:c=255, 255, 255, 64\n';
      blk += 'rangefinderTextScale:r=0.7\n';
      blk += 'rangefinderUseThousandth:b=no\n';
      blk += 'rangefinderVerticalOffset:r=0.1\n';
      blk += 'rangefinderHorizontalOffset:r=5\n';
      blk += 'detectAllyTextScale:r=0.7\n';
      blk += 'detectAllyOffset:p2=4, 0.05\n';
      blk += 'fontSizeMult:r=1\n';
      blk += 'lineSizeMult:r=1\n';
      blk += 'drawCentralLineVert:b=yes\n';
      blk += 'drawCentralLineHorz:b=yes\n';
      blk += 'drawSightMask:b=yes\n';
      blk += 'crosshairColor:c=0, 0, 0, 0\n';
      blk += 'crosshairLightColor:c=0, 0, 0, 0\n';
      blk += 'crosshairDistHorSizeMain:p2=0.03, 0.02\n';
      blk += 'crosshairDistHorSizeAdditional:p2=0.005, 0.003\n';
      blk += 'distanceCorrectionPos:p2=-0.26, -0.05\n';
      blk += 'drawDistanceCorrection:b=yes\n\n';
      blk += 'crosshair_distances{\n';
      blk += '  distance:p3=200, 0, 0\n';
      blk += '  distance:p3=400, 4, 0\n';
      blk += '  distance:p3=600, 0, 0\n';
      blk += '  distance:p3=800, 8, 0\n';
      blk += '  distance:p3=1000, 0, 0\n';
      blk += '  distance:p3=1200, 12, 0\n';
      blk += '  distance:p3=1400, 0, 0\n';
      blk += '  distance:p3=1600, 16, 0\n';
      blk += '  distance:p3=1800, 0, 0\n';
      blk += '  distance:p3=2000, 20, 0\n';
      blk += '  distance:p3=2200, 0, 0\n';
      blk += '  distance:p3=2400, 24, 0\n';
      blk += '  distance:p3=2600, 0, 0\n';
      blk += '  distance:p3=2800, 28, 0\n';
      blk += '  distance:p3=3000, 0, 0\n';
      blk += '  distance:p3=3200, 32, 0\n';
      blk += '  distance:p3=3400, 0, 0\n';
      blk += '  distance:p3=3600, 36, 0\n';
      blk += '  distance:p3=3800, 0, 0\n';
      blk += '  distance:p3=4000, 40, 0\n';
      blk += '  distance:p3=4200, 0, 0\n';
      blk += '  distance:p3=4400, 44, 0\n';
      blk += '  distance:p3=4600, 0, 0\n';
      blk += '  distance:p3=4800, 48, 0\n';
      blk += '  distance:p3=5000, 0, 0\n';
      blk += '  distance:p3=5200, 52, 0\n';
      blk += '  distance:p3=5400, 0, 0\n';
      blk += '  distance:p3=5600, 56, 0\n';
      blk += '  distance:p3=5800, 0, 0\n';
      blk += '  distance:p3=6000, 60, 0\n';
      blk += '}\n\n';
      blk += 'crosshair_hor_ranges{\n}\n\n';
      blk += 'matchExpClass {\nexp_tank:b = yes\nexp_heavy_tank:b = yes\nexp_tank_destroyer:b = yes\nexp_SPAA:b = yes\n}\n\n';
      // --- Экспорт линий ---
      blk += 'drawLines{\n';
      const linesLayer = this.layers.find(l => l.name === 'Линии');
      if (linesLayer && linesLayer.lines) {
        for (const line of linesLayer.lines) {
          for (let i = 1; i < line.points.length; i++) {
            const p1 = line.points[i - 1];
            const p2 = line.points[i];
            blk += `  line {line:p4=${p1.x},${p1.y},${p2.x},${p2.y};move:b=false;}\n`;
          }
        }
      }
      blk += '}\n';
      // --- Экспорт многоугольников (как quads, если 4 точки, иначе как poly) ---
      blk += 'drawQuads{\n';
      const poligonLayer = this.layers.find(l => l.name === 'Многоугольники');
      if (poligonLayer && poligonLayer.poligons) {
        for (const poly of poligonLayer.poligons) {
          if (poly.points.length === 4) {
            blk += `  quad {tl:p2 = ${poly.points[0].x},${poly.points[0].y};tr:p2 = ${poly.points[1].x},${poly.points[1].y};br:p2 = ${poly.points[2].x},${poly.points[2].y};bl:p2 = ${poly.points[3].x},${poly.points[3].y};}\n`;
          } else if (poly.points.length > 2) {
            // Разбиваем на треугольники и экспортируем каждый как quad (дублируя последнюю вершину)
            const tris = this.triangulatePolygon(poly.points);
            for (const tri of tris) {
              blk += `  quad {tl:p2 = ${tri[0].x},${tri[0].y};tr:p2 = ${tri[1].x},${tri[1].y};br:p2 = ${tri[2].x},${tri[2].y};bl:p2 = ${tri[2].x},${tri[2].y};}\n`;
            }
          }
        }
      }
      blk += '}\n';
      // --- Сохраняем файл ---
      const blob = new Blob([blk], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'export.blk';
      a.click();
      URL.revokeObjectURL(a.href);
    },
    onAutosave() {
      // TODO: реализовать автосохранение
      alert('Автосохранение!');
    },
    // --- Прозрачность картинки ---
    setReferenceOpacity(opacity) {
      this.referenceOpacity = opacity;
    },
    selectLayer(layerId) {
      this.selectedLayerId = layerId;
      const layer = this.layers.find(l => l.id === layerId);
      if (layer) {
        this.reference = layer.img;
        this.referenceSize = layer.size;
        this.referenceX = layer.shiftX;
        this.referenceY = layer.shiftY;
        this.referenceOpacity = layer.opacity;
      }
    },
    selectObject(layerId, objectId) {
      this.selectedLayerId = layerId;
      this.selectedObjectId = objectId;
      // Если объект — фото, обновляем reference для трансформации
      const layer = this.layers.find(l => l.id === layerId);
      if (layer) {
        this.reference = layer.img;
        this.referenceSize = layer.size;
        this.referenceX = layer.shiftX;
        this.referenceY = layer.shiftY;
        this.referenceOpacity = layer.opacity;
      }
    },
    addLayer() {
      const newId = 'layer' + (this.layers.length + 1);
      const layer = { id: newId, name: 'Слой ' + (this.layers.length + 1), img: null, width: 1, height: 1, shiftX: 0, shiftY: 0, opacity: 1 };
      this.layers.push(layer);
      // Добавляем запись в консоль
      this.consoleLog.push({
        type: 'Слой',
        settings: `id=${layer.id} name=${layer.name} width=${layer.width} height=${layer.height} opacity=${layer.opacity}`,
        svg: `<rect x="0" y="0" width="${layer.width}" height="${layer.height}" fill="none" stroke="black" opacity="${layer.opacity}"/>`
      });
    },
    // --- Трансформирование с маркерами ---
    getSelectedLayer() {
      return this.layers.find(l => l.id === this.selectedLayerId);
    },
    getTransformHandles(from, to) {
      // 8 маркеров: углы и середины сторон
      return [
        { x: from.x, y: from.y, type: 'resize-tl' },
        { x: (from.x + to.x) / 2, y: from.y, type: 'resize-t' },
        { x: to.x, y: from.y, type: 'resize-tr' },
        { x: to.x, y: (from.y + to.y) / 2, type: 'resize-r' },
        { x: to.x, y: to.y, type: 'resize-br' },
        { x: (from.x + to.x) / 2, y: to.y, type: 'resize-b' },
        { x: from.x, y: to.y, type: 'resize-bl' },
        { x: from.x, y: (from.y + to.y) / 2, type: 'resize-l' },
      ];
    },
    openLayerSettings(id) {
      this.layerSettingsId = id;
      const layer = this.layers.find(l => l.id === id);
      this.layerSettingsOpacity = layer ? Math.round((layer.opacity ?? 1) * 100) : 100;
      this.showLayerSettings = true;
    },
    closeLayerSettings() {
      this.showLayerSettings = false;
      this.layerSettingsId = null;
    },
    applyLayerSettings() {
      const layer = this.layers.find(l => l.id === this.layerSettingsId);
      if (layer) {
        layer.opacity = Math.max(0, Math.min(1, this.layerSettingsOpacity / 100));
      }
      this.closeLayerSettings();
    },
    resetSelectedLayerSize() {
      const layer = this.getSelectedLayer();
      if (layer && layer.img) {
        const aspect = layer.img.width / layer.img.height;
        const baseHeight = 0.5;
        layer.height = baseHeight;
        layer.width = baseHeight * aspect;
      }
    },
    toggleLayerLock(id) {
      const layer = this.layers.find(l => l.id === id);
      if (layer) layer.locked = !layer.locked;
      // Если заблокировали выделенный слой — снимаем выделение
      if (layer && layer.locked && this.selectedLayerId === id) {
        this.selectedLayerId = null;
      }
    },
    deleteLayer(id) {
      const idx = this.layers.findIndex(l => l.id === id);
      if (idx !== -1 && !this.layers[idx].locked) {
        this.layers.splice(idx, 1);
        if (this.selectedLayerId === id) this.selectedLayerId = null;
      }
    },
    moveLayer({id, dir}) {
      const idx = this.layers.findIndex(l => l.id === id);
      if (idx === -1 || this.layers[idx].locked) return;
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= this.layers.length) return;
      if (this.layers[newIdx].locked) return; // нельзя поменять местами с заблокированным
      const [layer] = this.layers.splice(idx, 1);
      this.layers.splice(newIdx, 0, layer);
    },
    editLayerName({id, name}) {
      const layer = this.layers.find(l => l.id === id);
      if (layer && !layer.locked) layer.name = name;
    },
    addLineToConsole(line) {
      if (!line || !line.points || line.points.length < 2) return;
      const ptsStr = line.points.map(p => `${p.x.toFixed(3)},${p.y.toFixed(3)}`).join(' ');
      const svg = `<polyline points="${line.points.map(p => `${p.x},${p.y}`).join(' ')}" stroke="black" fill="none"/>`;
      this.consoleLog.push({
        type: 'Линия',
        settings: `points: ${ptsStr}`,
        svg
      });
    },
    // --- Преобразования координат ---
    // Мировые (sight) -> экранные (canvas)
    sightToCanvas(sight) {
      return {
        x: (sight.x - this.screenPos.x) * this.screenZoom * 2000 + this.canvas.width / 2,
        y: (sight.y - this.screenPos.y) * this.screenZoom * 2000 + this.canvas.height / 2,
      };
    },
    // Экранные (canvas) -> мировые (sight)
    canvasToSight(canvasPt) {
      return {
        x: (canvasPt.x - this.canvas.width / 2) / (this.screenZoom * 2000) + this.screenPos.x,
        y: (canvasPt.y - this.canvas.height / 2) / (this.screenZoom * 2000) + this.screenPos.y,
      };
    },
    ensurePolygonsLayer() {
      let layer = this.layers.find(l => l.name === 'Многоугольники');
      if (!layer) {
        layer = { id: 'polygonsLayer', name: 'Многоугольники', type: 'polygons', polygons: [], img: null, width: 1, height: 1, shiftX: 0, shiftY: 0, opacity: 1 };
        this.layers.push(layer);
      }
      return layer;
    },
    // --- Триангуляция многоугольника (ear clipping, возвращает массив треугольников) ---
    triangulatePolygon(points) {
      // Используем earcut для надёжной триангуляции
      if (!points || points.length < 3) return [];
      const flat = points.flatMap(p => [p.x, p.y]);
      const indices = earcut(flat);
      const triangles = [];
      for (let i = 0; i < indices.length; i += 3) {
        triangles.push([
          points[indices[i]],
          points[indices[i + 1]],
          points[indices[i + 2]],
        ]);
      }
      return triangles;
    },
    openPreview() {
      this.showPreview = true;
      this.$nextTick(() => {
        this.renderPreview();
      });
    },
    renderPreview() {
      const canvas = this.$refs.previewCanvas;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Центр и масштаб
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const scale = 200; // подбирается под размер
      // Линии
      const linesLayer = this.layers.find(l => l.name === 'Линии');
      ctx.save();
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      if (linesLayer && linesLayer.lines) {
        for (const line of linesLayer.lines) {
          for (let i = 1; i < line.points.length; i++) {
            const p1 = line.points[i - 1];
            const p2 = line.points[i];
            ctx.beginPath();
            ctx.moveTo(cx + p1.x * scale, cy - p1.y * scale);
            ctx.lineTo(cx + p2.x * scale, cy - p2.y * scale);
            ctx.stroke();
          }
        }
      }
      ctx.restore();
      // Многоугольники (через триангуляцию)
      const poligonLayer = this.layers.find(l => l.name === 'Многоугольники');
      ctx.save();
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = 'black';
      if (poligonLayer && poligonLayer.polygons) {
        for (const poly of poligonLayer.polygons) {
          if (poly.points.length === 4) {
            ctx.beginPath();
            ctx.moveTo(cx + poly.points[0].x * scale, cy - poly.points[0].y * scale);
            for (let i = 1; i < 4; i++) {
              ctx.lineTo(cx + poly.points[i].x * scale, cy - poly.points[i].y * scale);
            }
            ctx.closePath();
            ctx.fill();
          } else if (poly.points.length > 2) {
            const tris = this.triangulatePolygon(poly.points);
            for (const tri of tris) {
              ctx.beginPath();
              ctx.moveTo(cx + tri[0].x * scale, cy - tri[0].y * scale);
              ctx.lineTo(cx + tri[1].x * scale, cy - tri[1].y * scale);
              ctx.lineTo(cx + tri[2].x * scale, cy - tri[2].y * scale);
              ctx.closePath();
              ctx.fill();
            }
          }
        }
      }
      ctx.restore();
    },
    isConvex(points) {
      if (points.length < 4) return true;
      let gotNegative = false;
      let gotPositive = false;
      const numPoints = points.length;
      for (let i = 0; i < numPoints; i++) {
        const p1 = points[i];
        const p2 = points[(i + 1) % numPoints];
        const p3 = points[(i + 2) % numPoints];
        const crossProduct = (p2.x - p1.x) * (p3.y - p2.y) - (p2.y - p1.y) * (p3.x - p2.x);
        if (crossProduct < 0) {
          gotNegative = true;
        } else if (crossProduct > 0) {
          gotPositive = true;
        }
        if (gotNegative && gotPositive) return false;
      }
      return true;
    },
    onDeletePolygon(e) {
      if (e.key === 'Delete' && this.selectedPolygonIdx !== null) {
        const polygonsLayer = this.ensurePolygonsLayer();
        if (polygonsLayer.polygons[this.selectedPolygonIdx]) {
          polygonsLayer.polygons.splice(this.selectedPolygonIdx, 1);
          this.selectedPolygonIdx = null;
        }
      }
    },
    onDeleteOrInsertSelected(e) {
      if ((e.key === 'Delete' || e.key === 'Insert') && this.tool === 'select' && this.selectedElement) {
        if (this.selectedElement.type === 'line') {
          const linesLayer = this.layers.find(l => l.name === 'Линии');
          if (linesLayer && linesLayer.lines && linesLayer.lines[this.selectedElement.idx]) {
            linesLayer.lines.splice(this.selectedElement.idx, 1);
            this.selectedElement = null;
          }
        } else if (this.selectedElement.type === 'polygon') {
          const polygonsLayer = this.ensurePolygonsLayer();
          if (polygonsLayer.polygons && polygonsLayer.polygons[this.selectedElement.idx]) {
            polygonsLayer.polygons.splice(this.selectedElement.idx, 1);
            this.selectedElement = null;
          }
        }
      }
    },
    // Универсальный поиск ближайшей вершины среди всех линий и многоугольников
    findNearestVertexUniversal(mx, my) {
      let minDist = 15;
      let found = null;
      // Линии
      const linesLayer = this.layers.find(l => l.name === 'Линии');
      if (linesLayer && linesLayer.lines) {
        linesLayer.lines.forEach((line) => {
          line.points.forEach((pt) => {
            const c = this.sightToCanvas(pt);
            const dist = Math.sqrt((mx - c.x) ** 2 + (my - c.y) ** 2);
            if (dist < minDist) {
              minDist = dist;
              found = { x: pt.x, y: pt.y };
            }
          });
        });
      }
      // Многоугольники
      const polygonsLayer = this.ensurePolygonsLayer();
      polygonsLayer.polygons.forEach((poly) => {
        poly.points.forEach((pt) => {
          const c = this.sightToCanvas(pt);
          const dist = Math.sqrt((mx - c.x) ** 2 + (my - c.y) ** 2);
          if (dist < minDist) {
            minDist = dist;
            found = { x: pt.x, y: pt.y };
          }
        });
      });
      return found;
    },
  },
  watch: {
    tool(newTool, oldTool) {
      if (oldTool === 'polygon' || newTool !== 'polygon') {
        this.drawingPolygon = null;
        this.isDrawingPolygon = false;
        this.hoveredPolyVertex = null;
      }
      if (oldTool === 'lines' || newTool !== 'lines') {
        this.drawingLine = null;
        this.isDrawingLine = false;
        this.hoveredVertex = null;
      }
    }
  }
};
</script>

<style scoped>
body {
  background: #fff;
}
.editor-bg {
  /* min-height: 100vh; */
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.editor-area {
  position: relative;
  width: 100vw;
  max-width: 100vw;
  height: 1080px;
  background: #fff;
  /* box-shadow: 0 0 40px #0004; */
  /* border-radius: 1em; */
  overflow: hidden;
}
#mainCanvas {
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 1080px;
  background: #fff;
  z-index: 1;
}
.menuIsland {
  background-color: white;
  border: 1px solid black;
  position: absolute;
  user-select: none;
  padding: 1em;
  border-radius: 1em;
  z-index: 2;
}
#objectsList {
  vertical-align: top;
  min-height: 5em;
  overflow-y: scroll;
  padding: 0.5em;
}
.objectRow {
  width: 100%;
  display: block;
  user-select: none;
  background-color: transparent;
  transition: 0.1s;
}
.objectRow:hover {
  background-color: rgba(100, 100, 100, 0.25);
}
button:disabled {
  background-color: rgba(20, 20, 20, 0.25);
}
a {
  text-decoration: none;
  color: black;
}
#layersMenu .menuIsland {
  min-width: 220px;
}
.modal-overlay {
  position: fixed;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-window {
  background: #23272f;
  border-radius: 1em;
  padding: 2em 2em 1em 2em;
  min-width: 320px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.28);
  color: #f8f8f8;
}
.modal-window h3 {
  color: #ffd700;
  margin-bottom: 1em;
}
.modal-window label {
  color: #f8f8f8;
  font-weight: 500;
  margin-bottom: 0.7em;
  display: block;
}
.modal-window input[type="number"] {
  background: #181a20;
  color: #ffd700;
  border: 1px solid #ffd700;
  border-radius: 5px;
  padding: 0.4em 0.8em;
  font-size: 1.1em;
  margin-left: 0.5em;
}
.modal-window button {
  background: #23272f;
  color: #ffd700;
  border: 1px solid #ffd700;
  border-radius: 6px;
  padding: 0.5em 1.2em;
  font-weight: 500;
  cursor: pointer;
  margin-left: 0.5em;
  transition: background 0.2s, color 0.2s;
}
.modal-window button:hover {
  background: #ffd700;
  color: #23272f;
}
.tool-panel {
  position: absolute;
  top: 2%;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  width: 200px;
  min-width: 200px;
  height: 60px;
  background: #2d2f3aee;
  color: #ffd700;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-bottom: 2px solid #ffd700;
  border-radius: 12px 12px 18px 18px;
  font-size: 1.2em;
  box-sizing: border-box;
  box-shadow: 0 4px 24px 0 #0006, 0 1.5px 0 #ffd700;
}
.tool-icon {
  width: 36px;
  height: 36px;
  margin: 0 8px;
  cursor: pointer;
  transition: filter 0.2s, box-shadow 0.2s;
}
.tool-icon.active {
  filter: brightness(1.3) drop-shadow(0 0 8px #ffd70088);
  box-shadow: 0 0 0 2px #ffd700;
  border-radius: 8px;
}
</style>
