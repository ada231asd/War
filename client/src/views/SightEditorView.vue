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
        ref="sightEditorMenu"
        :autoSaveEnabled="autoSaveEnabled"
        @image-loaded="onImageLoaded"
        @save="onSaveFile"
        @file-loaded="onFileLoaded"
        @export="onExportFile"
        @autosave="onAutosave"
        @preview-sight="onPreviewSight"
        @set-opacity="setReferenceOpacity"
        @reset-size="resetSelectedLayerSize"
      />
    
      <LayersPanel
        v-if="!isCanvasEmpty"
        :layers="layers"
        :selectedLayerId="selectedLayerId"
        :selectedObjectId="selectedObjectId"
        @select-layer="selectLayer"
        @select-object="selectObject"
        @add-layer="addLayer"
        @lock-layer="toggleLayerLock"
        @delete-layer="deleteLayer"
        @move-layer="moveLayer"
        @edit-layer-name="editLayerName"
        @set-layer-opacity="setLayerOpacity"
        style="position: fixed; right: 2em; top: 2em;"
      />
      
      <div id="hints" style="text-align: center; margin: auto; font-size: 0.8em; user-select: none;">
        <span id="hintsText"></span>
      </div>
      
      <!-- Индикатор автосохранения -->
      <div class="autosave-indicator" v-if="isAutoSaving">
        <span class="autosave-dot"></span>
        <span class="autosave-text">Сохранение...</span>
      </div>
      
      <a id="saver"></a>
      <button class="help-btn" @click="showHelp = true" title="Горячие клавиши" style="position:fixed;top:1em;left:1em;z-index:1001;background:#23272f;color:#ffd700;border:none;border-radius:50%;width:40px;height:40px;font-size:1.7em;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px #0006;cursor:pointer;">
        ?
      </button>
      <div v-if="showHelp" class="modal-overlay">
        <div class="modal-window" style="max-width:520px;">
          <h3>Справка по редактору прицелов</h3>
          
          <div style="text-align:left;font-size:1.1em;line-height:1.6;margin:1em 0;">
            <h4 style="color:#ffd700;margin-bottom:0.5em;">🎯 Основные инструменты:</h4>
            <ul style="margin:0.5em 0;padding-left:1.5em;">
              <li><b>Выборка</b> — выделение и редактирование объектов</li>
              <li><b>Линия</b> — создание линий прицела</li>
              <li><b>Многоугольник</b> — создание заливок</li>
            </ul>
            
            <h4 style="color:#ffd700;margin:1em 0 0.5em 0;">⌨️ Горячие клавиши:</h4>
            <ul style="margin:0.5em 0;padding-left:1.5em;">
              <li><b>Ctrl+Z</b> / <b>Ctrl+Я</b> — отменить действие</li>
              <li><b>Ctrl+Y</b> / <b>Ctrl+Н</b> — повторить действие</li>
              <li><b>Delete</b> — удалить выбранный объект</li>
              <li><b>Alt+колесо мыши</b> — масштабирование</li>
              <li><b>ПКМ</b> — перемещение холста</li>
            </ul>
            
            <h4 style="color:#ffd700;margin:1em 0 0.5em 0;">🔧 Полезные советы:</h4>
            <ul style="margin:0.5em 0;padding-left:1.5em;">
              <li>Зажмите <b>Ctrl</b> для привязки к вершинам</li>
              <li>Используйте <b>Shift+клик</b> для выделения многоугольников</li>
              <li>Двойной клик по первой точке замыкает многоугольник</li>
              <li>Автосохранение происходит каждые 30 секунд</li>
              <li>Экспортируйте в .blk для использования в игре</li>
            </ul>
            
            <h4 style="color:#ffd700;margin:1em 0 0.5em 0;">💾 Работа с файлами:</h4>
            <ul style="margin:0.5em 0;padding-left:1.5em;">
              <li><b>Сохранить</b> — сохранить проект в .txt</li>
              <li><b>Загрузить</b> — открыть сохраненный проект</li>
              <li><b>Экспорт</b> — создать .blk файл для игры</li>
              <li><b>Предпросмотр</b> — увидеть прицел в действии</li>
            </ul>
          </div>
          
          <div style="text-align:right;margin-top:1.5em;">
            <button @click="showHelp = false" style="background:#23272f;color:#ffd700;border:1px solid #ffd700;border-radius:6px;padding:0.5em 1.2em;font-size:1.1em;cursor:pointer;">Закрыть</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Компонент предпросмотра прицела -->
    <SightPreview
      :isVisible="showPreview"
      :layers="layers"
      @close="closePreview"
    />
  </div>
</template>

<script>
import editorConfig from '../sightEditor/config';
import SightEditorMenu from '../components/sightEditor/SightEditorMenu.vue';
import LayersPanel from '../components/sightEditor/LayersPanel.vue';
import SightPreview from '../components/sightEditor/SightPreview.vue';
import { drawGhostPolygon, findNearestVertex as findNearestPolyVertex } from '../components/sightEditor/tools/polygonTool.js';
import earcut from 'earcut';

export default {
  name: 'SightEditorView',
  components: { SightEditorMenu, LayersPanel, SightPreview },
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
      drawingLine: null, // временная линия (points: [{x, y}, ...])
      isDrawingLine: false, // флаг рисования линии
      isCtrlDown: false, // для поддержки Ctrl
      hoveredVertex: null, // {lineIdx, pointIdx, x, y} если есть подсвеченная вершина
      // --- polygon tool ---
      drawingPolygon: null, // { points: [{x, y}, ...] }
      isDrawingPolygon: false,
      hoveredPolyVertex: null, // {polyIdx, pointIdx, x, y}
      selectedPolygonIdx: null, // индекс выделенного многоугольника
      hoveredSnapVertex: null, // универсальная подсветка вершины
      selectedElement: null, // выбранный элемент для инструмента выборка
      showHelp: false,
      // --- автосохранение ---
      autoSaveEnabled: true, // Включено по умолчанию
      autoSaveInterval: null,
      autoSaveKey: 'sightEditor_autosave',
      autoSaveSettingsKey: 'sightEditor_settings',
      isAutoSaving: false,
      // --- консоль ---
      consoleLog: [],
      // --- предпросмотр прицела ---
      showPreview: false,
      previewBlkData: '',
      // --- история изменений для Ctrl+Z/Ctrl+Y ---
      history: [], // массив состояний для отмены/возврата
      historyIndex: -1, // текущий индекс в истории
      maxHistorySize: 50, // максимальное количество состояний в истории
      isUndoRedoAction: false, // флаг для предотвращения записи в историю при отмене/возврате
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
    
    // Загружаем настройки автосохранения
    this.loadAutosaveSettings();
    
    // Загружаем автосохраненные данные
    this.loadAutosavedData();
    
    // Создаем стандартный прицел если нет слоев
    if (this.layers.length === 0) {
      this.createDefaultSight();
    }
    
    // Инициализируем историю изменений
    this.saveToHistory();
    
    // Запускаем автосохранение
    this.startAutosave();
    
    // Добавляем глобальную функцию для отладки
    window.clearSightEditorStorage = () => {
      localStorage.removeItem('sightEditor_autosave');
      localStorage.removeItem('sightEditor_settings');
      console.log('✅ localStorage очищен. Обновите страницу.');
    };
    
    console.log('💡 Для очистки localStorage используйте: clearSightEditorStorage()');
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateCanvasSize);
    window.removeEventListener('wheel', this.onWheel);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('keydown', this.onDeletePolygon);
    window.removeEventListener('keydown', this.onDeleteOrInsertSelected);
    
    // Останавливаем автосохранение
    this.stopAutosave();
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
      
      // Инициализируем слои при загрузке
      this.ensureLinesLayer();
      this.ensurePolygonsLayer();
    },
    attachCanvasEvents() {
      this.canvas.onpointerover = () => { this.canvasHover = true; };
      this.canvas.onpointerleave = () => { 
        this.canvasHover = false; 
        this.clearDrawing(); 
        this.hoveredSnapVertex = null; // Сбрасываем подсветку вершины при выходе с холста
      };
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
      // --- заливаем области из fills ---
      this.drawStuff();
      this.drawArrows();
      this.drawGhost();
      // --- Подсветка выделенного многоугольника ---
      const polygonsLayer = this.ensurePolygonsLayer();
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
        
        // Линия от курсора к ближайшей вершине
        if (this.canvasHover) {
          this.ctx.save();
          this.ctx.strokeStyle = 'rgba(255,215,0,0.7)';
          this.ctx.lineWidth = 2;
          this.ctx.setLineDash([5, 5]);
          this.ctx.beginPath();
          this.ctx.moveTo(this.mousePos.x, this.mousePos.y);
          this.ctx.lineTo(c.x, c.y);
          this.ctx.stroke();
          this.ctx.restore();
        }
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
      // Рисуем все слои с учетом их прозрачности
      for (const layer of this.layers) {
        if (!layer.opacity || layer.opacity <= 0) continue; // Пропускаем полностью прозрачные слои
        
        this.ctx.save();
        this.ctx.globalAlpha = layer.opacity;
        
        // Рисуем линии
        if (layer.lines && layer.lines.length > 0) {
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;
          for (const line of layer.lines) {
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
        }
        
        // Рисуем многоугольники
        if (layer.polygons && layer.polygons.length > 0) {
        this.ctx.fillStyle = 'black';
          for (const poly of layer.polygons) {
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
        }
        
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
      if (this.tool === 'polygon') {
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
      
      // Обработка Ctrl+Z (отмена) - поддержка русской и английской раскладки
      if (e.ctrlKey && (e.key === 'z' || e.key === 'я') && !e.shiftKey) {
        e.preventDefault();
        this.undo();
      }
      
      // Обработка Ctrl+Y или Ctrl+Shift+Z (возврат) - поддержка русской и английской раскладки
      if ((e.ctrlKey && (e.key === 'y' || e.key === 'н')) || (e.ctrlKey && e.shiftKey && (e.key === 'z' || e.key === 'я'))) {
        e.preventDefault();
        this.redo();
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
        
        // Привязка к ближайшей вершине при зажатом Ctrl
        if (this.isCtrlDown && this.hoveredSnapVertex) {
          // Если зажат Ctrl и есть ближайшая вершина, выбираем объект, содержащий эту вершину
          const snapX = this.hoveredSnapVertex.x;
          const snapY = this.hoveredSnapVertex.y;
          
          // Ищем линию с этой вершиной
          const linesLayer = this.layers.find(l => l.name === 'Линии');
          if (linesLayer && linesLayer.lines) {
            linesLayer.lines.forEach((line, idx) => {
              line.points.forEach((pt) => {
                if (Math.abs(pt.x - snapX) < 0.001 && Math.abs(pt.y - snapY) < 0.001) {
                  foundType = 'line';
                  foundIdx = idx;
                }
              });
            });
          }
          
          // Ищем многоугольник с этой вершиной
          if (!foundType) {
            const polygonsLayer = this.ensurePolygonsLayer();
            polygonsLayer.polygons.forEach((poly, idx) => {
              poly.points.forEach((pt) => {
                if (Math.abs(pt.x - snapX) < 0.001 && Math.abs(pt.y - snapY) < 0.001) {
                  foundType = 'polygon';
                  foundIdx = idx;
                }
              });
            });
          }
        } else {
          // Обычный поиск ближайшего объекта с привязкой к вершинам
          let adjustedMx = mx;
          let adjustedMy = my;
          
          // Если есть ближайшая вершина, используем её координаты для поиска
          if (this.hoveredSnapVertex) {
            const snapCanvas = this.sightToCanvas(this.hoveredSnapVertex);
            adjustedMx = snapCanvas.x;
            adjustedMy = snapCanvas.y;
          }
          // Обычный поиск ближайшего объекта
                      // Линии: ищем ближайший сегмент
            const linesLayer = this.layers.find(l => l.name === 'Линии');
            if (linesLayer && linesLayer.lines) {
              linesLayer.lines.forEach((line, idx) => {
                for (let i = 1; i < line.points.length; i++) {
                  const c1 = this.sightToCanvas(line.points[i - 1]);
                  const c2 = this.sightToCanvas(line.points[i]);
                  const dist = this.pointToSegmentDist(adjustedMx, adjustedMy, c1.x, c1.y, c2.x, c2.y);
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
              if (this.pointInPolygon(adjustedMx, adjustedMy, screenPoints)) {
                minDist = 0; // приоритет
                foundType = 'polygon';
                foundIdx = idx;
              } else {
                for (let i = 1; i <= screenPoints.length; i++) {
                  const c1 = screenPoints[i - 1];
                  const c2 = screenPoints[i % screenPoints.length];
                  const dist = this.pointToSegmentDist(adjustedMx, adjustedMy, c1.x, c1.y, c2.x, c2.y);
                  if (dist < minDist) {
                    minDist = dist;
                    foundType = 'polygon';
                    foundIdx = idx;
                  }
                }
              }
            });
        }
        
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
        
        // Привязка к ближайшей вершине при зажатом Ctrl
        let adjustedMx = mx;
        let adjustedMy = my;
        if (this.isCtrlDown && this.hoveredSnapVertex) {
          const snapCanvas = this.sightToCanvas(this.hoveredSnapVertex);
          adjustedMx = snapCanvas.x;
          adjustedMy = snapCanvas.y;
        }
        
        polygonsLayer.polygons.forEach((poly, idx) => {
          // Проверяем расстояние до центра масс
          const cx = poly.points.reduce((sum, p) => sum + p.x, 0) / poly.points.length;
          const cy = poly.points.reduce((sum, p) => sum + p.y, 0) / poly.points.length;
          const c = this.sightToCanvas({ x: cx, y: cy });
          const dist = Math.sqrt((adjustedMx - c.x) ** 2 + (adjustedMy - c.y) ** 2);
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
            // Сохраняем состояние при добавлении многоугольника
            this.saveState();
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
            // Сохраняем состояние при добавлении линии
            this.saveState();
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
            // Сохраняем состояние при добавлении линии
            this.saveState();
          }
        }
        return;
      }
      this.isCtrlDown = false;
      this.hoveredVertex = null;
      this.drawingPolygon = null;
      this.isDrawingPolygon = false;
      this.hoveredPolyVertex = null;
    },
    onPointerMove(e) {
      // Обновляем позицию мыши
      const rect = this.canvas.getBoundingClientRect();
      this.mousePos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      
      if (this.dragging) {
        const dx = (e.clientX - this.lastDragPos.x) / (this.screenZoom * 2000);
        const dy = (e.clientY - this.lastDragPos.y) / (this.screenZoom * 2000);
        this.screenPos.x -= dx;
        this.screenPos.y -= dy;
        this.lastDragPos = { x: e.clientX, y: e.clientY };
        return;
      }
      // --- Перемещение/трансформация слоя ---
      if (this.isTransforming && this.selectedLayerId) {
        const layer = this.layers.find(l => l.id === this.selectedLayerId && l.img);
        if (layer && this.transformStart) {
          const rect = this.canvas.getBoundingClientRect();
          const mx = e.clientX - rect.left;
          const my = e.clientY - rect.top;
          const dx = (mx - this.transformStart.x) / (this.screenZoom * 2000);
          const dy = (my - this.transformStart.y) / (this.screenZoom * 2000);
          if (this.transformMode === 'move') {
            let newShiftX = this.transformStart.shiftX + dx;
            let newShiftY = this.transformStart.shiftY + dy;
            
            // Привязка к ближайшей вершине при зажатом Ctrl
            if (this.isCtrlDown && this.hoveredSnapVertex) {
              // Вычисляем центр слоя
              const layerCenterX = newShiftX;
              const layerCenterY = newShiftY;
              
              // Находим ближайшую вершину к центру слоя
              const nearestVertex = this.hoveredSnapVertex;
              const vertexDist = Math.sqrt(
                (layerCenterX - nearestVertex.x) ** 2 + 
                (layerCenterY - nearestVertex.y) ** 2
              );
              
              // Если вершина достаточно близко, привязываем к ней
              if (vertexDist < 0.1) { // 0.1 в координатах sight
                newShiftX = nearestVertex.x;
                newShiftY = nearestVertex.y;
              }
            }
            
            layer.shiftX = newShiftX;
            layer.shiftY = newShiftY;
          } else if (this.transformMode && this.transformMode.startsWith('resize')) {
            // Определяем, какой маркер тянем
            let w = this.transformStart.width;
            let h = this.transformStart.height;
            let x = this.transformStart.shiftX;
            let y = this.transformStart.shiftY;
            // Для простоты: resize от центра, меняем ширину/высоту и сдвиг
            if (this.transformMode === 'resize-tl') {
              w = this.transformStart.width - dx;
              h = this.transformStart.height - dy;
              x = this.transformStart.shiftX + dx / 2;
              y = this.transformStart.shiftY + dy / 2;
            } else if (this.transformMode === 'resize-tr') {
              w = this.transformStart.width + dx;
              h = this.transformStart.height - dy;
              x = this.transformStart.shiftX + dx / 2;
              y = this.transformStart.shiftY + dy / 2;
            } else if (this.transformMode === 'resize-br') {
              w = this.transformStart.width + dx;
              h = this.transformStart.height + dy;
              x = this.transformStart.shiftX + dx / 2;
              y = this.transformStart.shiftY + dy / 2;
            } else if (this.transformMode === 'resize-bl') {
              w = this.transformStart.width - dx;
              h = this.transformStart.height + dy;
              x = this.transformStart.shiftX + dx / 2;
              y = this.transformStart.shiftY + dy / 2;
            } else if (this.transformMode === 'resize-t') {
              h = this.transformStart.height - dy;
              y = this.transformStart.shiftY + dy / 2;
            } else if (this.transformMode === 'resize-b') {
              h = this.transformStart.height + dy;
              y = this.transformStart.shiftY + dy / 2;
            } else if (this.transformMode === 'resize-l') {
              w = this.transformStart.width - dx;
              x = this.transformStart.shiftX + dx / 2;
            } else if (this.transformMode === 'resize-r') {
              w = this.transformStart.width + dx;
              x = this.transformStart.shiftX + dx / 2;
            }
            // Минимальные размеры
            layer.width = Math.max(0.01, w);
            layer.height = Math.max(0.01, h);
            layer.shiftX = x;
            layer.shiftY = y;
          }
          
          // Сохраняем состояние при трансформации слоя
          this.saveState();
        }
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
          // Привязка к ближайшей вершине при зажатом Ctrl
          if (this.isCtrlDown && this.hoveredSnapVertex) {
            this.drawingLine.ghost = { x: this.hoveredSnapVertex.x, y: this.hoveredSnapVertex.y };
          } else {
            this.drawingLine.ghost = { x, y };
          }
        }
      }
      // Призрак многоугольника
      if (this.tool === 'polygon' && this.isDrawingPolygon && this.drawingPolygon) {
        const rect = this.canvas.getBoundingClientRect();
        const canvasPt = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        const { x, y } = this.canvasToSight(canvasPt);
        // Привязка к ближайшей вершине при зажатом Ctrl
        if (this.isCtrlDown && this.hoveredSnapVertex) {
          this.drawingPolygon.ghost = { x: this.hoveredSnapVertex.x, y: this.hoveredSnapVertex.y };
        } else {
          this.drawingPolygon.ghost = { x, y };
        }
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
          // Проверяем попадание в маркер с учетом привязки к вершинам
          let checkMx = mx;
          let checkMy = my;
          if (this.isCtrlDown && this.hoveredSnapVertex) {
            const snapCanvas = this.sightToCanvas(this.hoveredSnapVertex);
            checkMx = snapCanvas.x;
            checkMy = snapCanvas.y;
          }
          
          if (checkMx >= h.x - 8 && checkMx <= h.x + 8 && checkMy >= h.y - 8 && checkMy <= h.y + 8) {
            this.selectedLayerId = layer.id;
            this.isTransforming = true;
            this.transformMode = h.type;
            this.transformStart = { x: mx, y: my, ...layer };
            hit = true;
            break;
          }
        }
        if (hit) break;
        // --- Исправление: свободная трансформация только при tool === 'select' ---
        if (this.tool === 'select' && this.freeTransform && this.selectedLayerId === layer.id && layer.img) {
          // Проверяем попадание в слой с учетом привязки к вершинам
          let checkMx = mx;
          let checkMy = my;
          if (this.isCtrlDown && this.hoveredSnapVertex) {
            const snapCanvas = this.sightToCanvas(this.hoveredSnapVertex);
            checkMx = snapCanvas.x;
            checkMy = snapCanvas.y;
          }
          
          if (checkMx >= from.x && checkMx <= to.x && checkMy >= from.y && checkMy <= to.y) {
            this.isTransforming = true;
            this.transformMode = 'move';
            this.transformStart = { x: mx, y: my, ...layer };
            hit = true;
            break;
          }
        }
        // Проверяем попадание в слой с учетом привязки к вершинам
        let checkMx = mx;
        let checkMy = my;
        if (this.isCtrlDown && this.hoveredSnapVertex) {
          const snapCanvas = this.sightToCanvas(this.hoveredSnapVertex);
          checkMx = snapCanvas.x;
          checkMy = snapCanvas.y;
        }
        
        if (checkMx >= from.x && checkMx <= to.x && checkMy >= from.y && checkMy <= to.y) {
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
      // Сохраняем состояние при загрузке изображения
      this.saveState();
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
            // Сохраняем состояние при загрузке SVG
            this.saveState();
          };
          img.src = url;
        } else {
          // TXT: восстанавливаем состояние
          const data = JSON.parse(fileContent);
          this.layers = data.layers.map((l, i) => ({ ...l, img: null }));
          this.screenPos = data.screenPos || { x: 0, y: 0.1 };
          this.screenZoom = data.screenZoom || 0.2;
          this.gridSize = data.gridSize || 0.1;
          // Сохраняем состояние при загрузке TXT
          this.saveState();
        }
      } catch (e) {
        alert('Ошибка загрузки файла: ' + e.message);
      }
    },
    generateBlkContent() {
      // Генерируем содержимое .blk файла
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
      
      // --- Дистанции прицела ---
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
      if (linesLayer && linesLayer.lines && linesLayer.lines.length > 0) {
        for (const line of linesLayer.lines) {
          if (line.points && line.points.length > 1) {
            for (let i = 1; i < line.points.length; i++) {
              const p1 = line.points[i - 1];
              const p2 = line.points[i];
              blk += `  line {line:p4=${p1.x.toFixed(6)},${p1.y.toFixed(6)},${p2.x.toFixed(6)},${p2.y.toFixed(6)};move:b=false;}\n`;
            }
          }
        }
      }
      blk += '}\n';
      
      // --- Экспорт многоугольников ---
      blk += 'drawQuads{\n';
      const poligonLayer = this.layers.find(l => l.name === 'Многоугольники');
      if (poligonLayer && poligonLayer.polygons && poligonLayer.polygons.length > 0) {
        for (const poly of poligonLayer.polygons) {
          if (poly.points && poly.points.length >= 3) {
            if (poly.points.length === 4) {
              // Четырехугольник - экспортируем как quad
              blk += `  quad {tl:p2 = ${poly.points[0].x.toFixed(6)},${poly.points[0].y.toFixed(6)};tr:p2 = ${poly.points[1].x.toFixed(6)},${poly.points[1].y.toFixed(6)};br:p2 = ${poly.points[2].x.toFixed(6)},${poly.points[2].y.toFixed(6)};bl:p2 = ${poly.points[3].x.toFixed(6)},${poly.points[3].y.toFixed(6)};}\n`;
            } else if (poly.points.length > 2) {
              // Многоугольник с более чем 4 точками - разбиваем на треугольники
              const tris = this.triangulatePolygon(poly.points);
              for (const tri of tris) {
                blk += `  quad {tl:p2 = ${tri[0].x.toFixed(6)},${tri[0].y.toFixed(6)};tr:p2 = ${tri[1].x.toFixed(6)},${tri[1].y.toFixed(6)};br:p2 = ${tri[2].x.toFixed(6)},${tri[2].y.toFixed(6)};bl:p2 = ${tri[2].x.toFixed(6)},${tri[2].y.toFixed(6)};}\n`;
              }
            }
          }
        }
      }
      blk += '}\n';
      
      return blk;
    },
    
    onExportFile(fileName) {
      // Проверяем готовность к экспорту
      const validationResult = this.validateExportData();
      if (!validationResult.isValid) {
        alert(`Ошибка валидации: ${validationResult.message}`);
        return;
      }
      
      const blk = this.generateBlkContent();
      // --- Сохраняем файл ---
      const blob = new Blob([blk], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = (fileName || 'export') + '.blk';
      a.click();
      URL.revokeObjectURL(a.href);
      
      // Очищаем автосохраненные данные и историю при успешном экспорте
      this.clearAutosaveData();
      this.clearHistory();
      
      // Показываем уведомление об успешном экспорте
      alert(`Файл успешно экспортирован!\n${validationResult.message}`);
    },
    

    
    validateExportData() {
      // Проверяем, есть ли данные для экспорта
      let hasLines = false;
      let hasPolygons = false;
      let lineCount = 0;
      let polygonCount = 0;
      
      // Проверяем слой линий
      const linesLayer = this.layers.find(l => l.name === 'Линии');
      if (linesLayer && linesLayer.lines && linesLayer.lines.length > 0) {
        for (const line of linesLayer.lines) {
          if (line.points && line.points.length >= 2) {
            hasLines = true;
            lineCount += line.points.length - 1; // Количество сегментов линии
          }
        }
      }
      
      // Проверяем слой многоугольников
      const poligonLayer = this.layers.find(l => l.name === 'Многоугольники');
      if (poligonLayer && poligonLayer.polygons && poligonLayer.polygons.length > 0) {
        for (const poly of poligonLayer.polygons) {
          if (poly.points && poly.points.length >= 3) {
            hasPolygons = true;
            polygonCount++;
          }
        }
      }
      
      if (!hasLines && !hasPolygons) {
        return {
          isValid: false,
          message: 'Нет данных для экспорта. Добавьте линии или многоугольники на холст.'
        };
      }
      
      return { 
        isValid: true, 
        lineCount, 
        polygonCount,
        message: `Готово к экспорту: ${lineCount} сегментов линий, ${polygonCount} многоугольников`
      };
    },
    onAutosave() {
      // Этот метод вызывается из SightEditorMenu
      this.toggleAutosave(!this.autoSaveEnabled);
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
      // Сохраняем состояние при добавлении слоя
      this.saveState();
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
    // openLayerSettings() {}, closeLayerSettings() {}, applyLayerSettings() {} // удалены
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
        // Сохраняем состояние при удалении слоя
        this.saveState();
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
      // Сохраняем состояние при перемещении слоя
      this.saveState();
    },
    editLayerName({id, name}) {
      const layer = this.layers.find(l => l.id === id);
      if (layer && !layer.locked) {
        layer.name = name;
        // Сохраняем состояние при изменении имени слоя
        this.saveState();
      }
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
          // Сохраняем состояние при удалении многоугольника
          this.saveState();
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
            // Сохраняем состояние при удалении линии
            this.saveState();
          }
        } else if (this.selectedElement.type === 'polygon') {
          const polygonsLayer = this.ensurePolygonsLayer();
          if (polygonsLayer.polygons && polygonsLayer.polygons[this.selectedElement.idx]) {
            polygonsLayer.polygons.splice(this.selectedElement.idx, 1);
            this.selectedElement = null;
            // Сохраняем состояние при удалении многоугольника
            this.saveState();
          }
        }
      }
    },
    // Универсальный поиск ближайшей вершины среди всех линий и многоугольников
    findNearestVertexUniversal(mx, my) {
      let minDist = 20; // Увеличиваем радиус привязки для удобства
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
    setLayerOpacity({id, opacity}) {
      const layer = this.layers.find(l => l.id === id);
      if (layer) {
        layer.opacity = opacity;
        // Сохраняем состояние при изменении прозрачности слоя
        this.saveState();
      }
    },
    
    // --- Автосохранение ---
    saveToAutosave() {
      if (!this.autoSaveEnabled) return;
      
      this.isAutoSaving = true;
      
      try {
        // Оптимизированная структура данных для минимального размера
        const dataToSave = {
          // Слои - только необходимые данные
          l: this.layers.map(layer => ({
            id: layer.id,
            n: layer.name, // name
            t: layer.type, // type
            w: layer.width, // width
            h: layer.height, // height
            sx: layer.shiftX, // shiftX
            sy: layer.shiftY, // shiftY
            o: layer.opacity, // opacity
            // Линии - только точки
            ln: layer.lines ? layer.lines.map(line => ({
              p: line.points.map(p => [p.x, p.y]) // points как массив [x, y]
            })) : undefined,
            // Многоугольники - только точки
            pg: layer.polygons ? layer.polygons.map(poly => ({
              p: poly.points.map(p => [p.x, p.y]) // points как массив [x, y]
            })) : undefined
          })),
          // Позиция и масштаб
          sp: [this.screenPos.x, this.screenPos.y], // screenPos
          sz: this.screenZoom, // screenZoom
          gs: this.gridSize, // gridSize
          ts: Date.now() // timestamp
        };
        
        localStorage.setItem(this.autoSaveKey, JSON.stringify(dataToSave));
        console.log('Автосохранение выполнено:', new Date().toLocaleTimeString());
      } catch (error) {
        console.error('Ошибка автосохранения:', error);
      } finally {
        // Скрываем индикатор через 1 секунду
        setTimeout(() => {
          this.isAutoSaving = false;
        }, 1000);
      }
    },
    
    loadAutosavedData() {
      try {
        const savedData = localStorage.getItem(this.autoSaveKey);
        if (savedData) {
          const data = JSON.parse(savedData);
          
          // Проверяем возраст данных (7 дней)
          const dataAge = Date.now() - data.ts;
          const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 дней в миллисекундах
          
          if (dataAge > maxAge) {
            console.log('Автосохраненные данные устарели, удаляем');
            this.clearAutosaveData();
            return;
          }
          
          // Восстанавливаем данные
          this.layers = data.l.map(layer => ({
            id: layer.id,
            name: layer.n,
            type: layer.t,
            width: layer.w,
            height: layer.h,
            shiftX: layer.sx,
            shiftY: layer.sy,
            opacity: layer.o,
            lines: layer.ln ? layer.ln.map(line => ({ points: line.p.map(p => ({ x: p[0], y: p[1] })) })) : undefined,
            polygons: layer.pg ? layer.pg.map(poly => ({ points: poly.p.map(p => ({ x: p[0], y: p[1] })) })) : undefined
          }));
          
          this.screenPos = { x: data.sp[0], y: data.sp[1] };
          this.screenZoom = data.sz;
          this.gridSize = data.gs;
          
          console.log('Автосохраненные данные восстановлены');
        }
      } catch (error) {
        console.error('Ошибка загрузки автосохраненных данных:', error);
        this.clearAutosaveData();
      }
    },
    
    clearAutosaveData() {
      try {
        localStorage.removeItem(this.autoSaveKey);
        // НЕ удаляем настройки при экспорте, только данные
        console.log('Автосохраненные данные очищены');
      } catch (error) {
        console.error('Ошибка очистки автосохраненных данных:', error);
      }
    },
    
    startAutosave() {
      if (this.autoSaveInterval) {
        clearInterval(this.autoSaveInterval);
      }
      
      this.autoSaveInterval = setInterval(() => {
        this.saveToAutosave();
      }, 30000); // Автосохранение каждые 30 секунд
      
      console.log('Автосохранение включено');
    },
    
    stopAutosave() {
      if (this.autoSaveInterval) {
        clearInterval(this.autoSaveInterval);
        this.autoSaveInterval = null;
        console.log('Автосохранение отключено');
      }
    },
    
    toggleAutosave(enabled) {
      this.autoSaveEnabled = enabled;
      
      // Сохраняем настройки в кеш
      this.saveAutosaveSettings();
      
      if (enabled) {
        this.startAutosave();
        // Сразу сохраняем текущее состояние
        this.saveToAutosave();
      } else {
        this.stopAutosave();
      }
    },
    
    // Сохранение настроек автосохранения
    saveAutosaveSettings() {
      try {
        const settings = {
          enabled: this.autoSaveEnabled,
          timestamp: Date.now()
        };
        localStorage.setItem(this.autoSaveSettingsKey, JSON.stringify(settings));
      } catch (error) {
        console.error('Ошибка сохранения настроек автосохранения:', error);
      }
    },
    
    // Загрузка настроек автосохранения
    loadAutosaveSettings() {
      try {
        const savedSettings = localStorage.getItem(this.autoSaveSettingsKey);
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          
          // Проверяем, что настройки не слишком старые (например, не старше 30 дней)
          const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 дней в миллисекундах
          if (settings.timestamp && (Date.now() - settings.timestamp) > maxAge) {
            console.log('Настройки автосохранения устарели, используем значения по умолчанию');
            return;
          }
          
          this.autoSaveEnabled = settings.enabled !== undefined ? settings.enabled : true;
          
          // Если автосохранение включено, запускаем его
          if (this.autoSaveEnabled) {
            this.startAutosave();
          }
        }
      } catch (error) {
        console.error('Ошибка загрузки настроек автосохранения:', error);
        // Используем значения по умолчанию
        this.autoSaveEnabled = true;
        this.startAutosave();
      }
    },
    
    // --- Предпросмотр прицела ---
    onPreviewSight() {
      console.log('SightEditorView: onPreviewSight - все слои:', this.layers);
      
      // Выводим все имена слоев
      console.log('SightEditorView: имена всех слоев:');
      this.layers.forEach((layer, index) => {
        console.log(`  Слой ${index + 1}: "${layer.name}" (тип: ${layer.type})`);
      });
      
      // Проверяем наличие слоев "Линии" и "Многоугольники"
      const linesLayer = this.layers.find(l => l.name === 'Линии');
      const polygonLayer = this.layers.find(l => l.name === 'Многоугольники');
      
      console.log('SightEditorView: слой линий:', linesLayer);
      console.log('SightEditorView: слой многоугольников:', polygonLayer);
      
      if (linesLayer) {
        console.log('SightEditorView: линий найдено:', linesLayer.lines ? linesLayer.lines.length : 0);
        if (linesLayer.lines) {
          for (let i = 0; i < linesLayer.lines.length; i++) {
            console.log(`SightEditorView: линия ${i + 1}:`, linesLayer.lines[i]);
            if (linesLayer.lines[i].points) {
              console.log(`SightEditorView: линия ${i + 1} координаты:`, linesLayer.lines[i].points);
              linesLayer.lines[i].points.forEach((point, j) => {
                console.log(`  Точка ${j + 1}: x=${point.x}, y=${point.y}`);
              });
            }
          }
        }
      }
      
      if (polygonLayer) {
        console.log('SightEditorView: многоугольников найдено:', polygonLayer.polygons ? polygonLayer.polygons.length : 0);
        if (polygonLayer.polygons) {
          for (let i = 0; i < polygonLayer.polygons.length; i++) {
            console.log(`SightEditorView: многоугольник ${i + 1}:`, polygonLayer.polygons[i]);
          }
        }
      }
      
      // Показываем предпросмотр с текущими слоями
      this.showPreview = true;
    },
    
    closePreview() {
      this.showPreview = false;
    },
    
    // Создание стандартного прицела по умолчанию
    createDefaultSight() {
      // Создаем слой с многоугольником (темно-серый)
      const polygonLayer = {
        id: Date.now() + 1,
        name: 'Многоугольники',
        type: 'polygon',
        width: 100,
        height: 100,
        shiftX: 0,
        shiftY: 0,
        opacity: 0.7,
        polygons: [{
          points: [
            { x: -30, y: 20 },   // top-left
            { x: 30, y: 20 },    // top-right
            { x: 40, y: 10 },    // far-right
            { x: 30, y: -10 },   // bottom-right
            { x: -20, y: -10 },  // bottom-left
            { x: -30, y: 10 }    // far-left
          ]
        }]
      };
      
      // Создаем слой с линиями (черные)
      const linesLayer = {
        id: Date.now() + 2,
        name: 'Линии',
        type: 'line',
        width: 100,
        height: 100,
        shiftX: 0,
        shiftY: 0,
        opacity: 1.0,
        lines: [
          // Линия от точки (+5, -5) к top-left вершине (-30, 20)
          {
            points: [
              { x: 5, y: -5 },
              { x: -30, y: 20 }
            ]
          },
          // Линия от точки (+5, -5) к top-right вершине (30, 20)
          {
            points: [
              { x: 5, y: -5 },
              { x: 30, y: 20 }
            ]
          },
          // Линия от точки (+5, -5) к bottom-left вершине (-20, -10)
          {
            points: [
              { x: 5, y: -5 },
              { x: -20, y: -10 }
            ]
          }
        ]
      };
      
      // Добавляем слои
      this.layers.push(polygonLayer, linesLayer);
      
      // Сохраняем состояние
      this.saveState();
    },

    // --- Методы для работы с историей изменений ---
    
    // Сохранение текущего состояния в историю
    saveToHistory() {
      if (this.isUndoRedoAction) return; // Не сохраняем при отмене/возврате
      
      // Создаем глубокую копию текущего состояния
      const currentState = this.createStateSnapshot();
      
      // Удаляем все состояния после текущего индекса (если мы находимся не в конце истории)
      if (this.historyIndex < this.history.length - 1) {
        this.history = this.history.slice(0, this.historyIndex + 1);
      }
      
      // Добавляем новое состояние
      this.history.push(currentState);
      this.historyIndex++;
      
      // Ограничиваем размер истории
      if (this.history.length > this.maxHistorySize) {
        this.history.shift();
        this.historyIndex--;
      }
      
      console.log(`История обновлена: ${this.history.length} состояний, индекс: ${this.historyIndex}`);
    },
    
    // Создание снимка текущего состояния
    createStateSnapshot() {
      return {
        layers: JSON.parse(JSON.stringify(this.layers)), // Глубокая копия слоев
        screenPos: { ...this.screenPos },
        screenZoom: this.screenZoom,
        gridSize: this.gridSize,
        selectedLayerId: this.selectedLayerId,
        selectedObjectId: this.selectedObjectId,
        selectedPolygonIdx: this.selectedPolygonIdx,
        selectedElement: this.selectedElement ? { ...this.selectedElement } : null,
        timestamp: Date.now()
      };
    },
    
    // Восстановление состояния из истории
    restoreFromHistory(state) {
      this.isUndoRedoAction = true; // Предотвращаем запись в историю
      
      // Восстанавливаем состояние
      this.layers = JSON.parse(JSON.stringify(state.layers));
      this.screenPos = { ...state.screenPos };
      this.screenZoom = state.screenZoom;
      this.gridSize = state.gridSize;
      this.selectedLayerId = state.selectedLayerId;
      this.selectedObjectId = state.selectedObjectId;
      this.selectedPolygonIdx = state.selectedPolygonIdx;
      this.selectedElement = state.selectedElement ? { ...state.selectedElement } : null;
      
      // Сбрасываем временные состояния
      this.drawingLine = null;
      this.isDrawingLine = false;
      this.drawingPolygon = null;
      this.isDrawingPolygon = false;
      this.isTransforming = false;
      this.transformMode = null;
      
      // Автосохранение после восстановления
      this.saveToAutosave();
      
      setTimeout(() => {
        this.isUndoRedoAction = false;
      }, 100);
    },
    
    // Отмена последнего действия (Ctrl+Z)
    undo() {
      if (this.historyIndex > 0) {
        this.historyIndex--;
        const previousState = this.history[this.historyIndex];
        this.restoreFromHistory(previousState);
        console.log(`Отменено действие. Индекс истории: ${this.historyIndex}`);
      } else {
        console.log('Нет действий для отмены');
      }
    },
    
    // Возврат отмененного действия (Ctrl+Y)
    redo() {
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        const nextState = this.history[this.historyIndex];
        this.restoreFromHistory(nextState);
        console.log(`Возвращено действие. Индекс истории: ${this.historyIndex}`);
      } else {
        console.log('Нет действий для возврата');
      }
    },
    
    // Очистка истории
    clearHistory() {
      this.history = [];
      this.historyIndex = -1;
      console.log('История очищена');
    },
    
    // Вспомогательный метод для сохранения состояния
    saveState() {
      this.saveToHistory();
      this.saveToAutosave();
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
  },
  computed: {
    // Проверяем, есть ли на холсте какие-либо объекты (линии, многоугольники, изображения)
    isCanvasEmpty() {
      // Проверяем наличие изображений
      const hasImages = this.layers.some(layer => layer.img);
      
      // Проверяем наличие линий
      const linesLayer = this.layers.find(l => l.name === 'Линии');
      const hasLines = linesLayer && linesLayer.lines && linesLayer.lines.length > 0;
      
      // Проверяем наличие многоугольников
      const polygonsLayer = this.layers.find(l => l.name === 'Многоугольники');
      const hasPolygons = polygonsLayer && polygonsLayer.polygons && polygonsLayer.polygons.length > 0;
      
      // Проверяем, есть ли временные объекты в процессе рисования
      const hasTemporaryObjects = this.isDrawingLine || this.isDrawingPolygon;
      
      return !hasImages && !hasLines && !hasPolygons && !hasTemporaryObjects;
    }
  }
};
</script>

<style scoped>
body {
  background: #fff;
  overflow-x: hidden;
}
.editor-bg {
  /* min-height: 100vh; */
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-x: hidden;
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
  overflow-x: hidden;
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
.help-btn {
  position: fixed;
  top: 1em;
  left: 1em;
  z-index: 1001;
  background: #23272f;
  color: #ffd700;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.7em;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px #0006;
  cursor: pointer;
}
.help-btn:hover {
  background: #ffd700;
  color: #23272f;
}

/* Индикатор автосохранения */
.autosave-indicator {
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: rgba(35, 39, 47, 0.9);
  color: #ffd700;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 1000;
  border: 1px solid #ffd700;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: opacity 0.3s ease;
}

.autosave-dot {
  width: 8px;
  height: 8px;
  background: #ffd700;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.autosave-text {
  white-space: nowrap;
}
</style>
