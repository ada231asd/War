<template>
  <div class="editor-bg">
    <div class="editor-area" ref="editorArea">
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
      
      <div id="toolsMenu" class="menuIsland" style="left: 1em; bottom: 1em;">
        <hr id="toolsMenuDragger" size="10px" style="background-color: lightgray; margin: 0">
        <span id="toolTitle">Инструмент</span>:<br>
        <button id="toolsLinesButton"><span style="display:inline-block;width:3em;height:3em;background:#eee;border:1px solid black;"></span></button>
        <button id="toolsQuadsButton"><span style="display:inline-block;width:3em;height:3em;background:#eee;border:1px solid black;"></span></button>
        <br><br>
        <span id="opacityTitle">Непрозрачность</span>:<br><input id="opacityInput" type="range" value="0.8" min="0" max="1" step="0.05"><br><br>
        <span id="massLabel">Преобразование рисунка</span>:<br>
        <table>
          <tbody>
            <tr>
              <td><span id="massXLabel">Смещение X</span>:<br></td>
              <td><input id="massX" type="number" value="0" step="0.01" style="width: 6em"></td>
            </tr>
            <tr>
              <td><span id="massYLabel">Смещение Y</span>:<br></td>
              <td><input id="massY" type="number" value="0" step="0.01" style="width: 6em"></td>
            </tr>
            <tr>
              <td><span id="massRLabel">Поворот</span>:<br></td>
              <td><input id="massR" type="number" value="0" step="1" style="width: 6em"></td>
            </tr>
            <tr>
              <td><span id="massSXLabel">Масштаб X</span>:<br></td>
              <td><input id="massSX" type="number" value="1" step="0.01" style="width: 6em"></td>
            </tr>
            <tr>
              <td><span id="massSYLabel">Масштаб Y</span>:<br></td>
              <td><input id="massSY" type="number" value="1" step="0.01" style="width: 6em"></td>
            </tr>
            <tr>
              <td></td>
              <td><button id="massB">Применить</button></td>
            </tr>
          </tbody>
        </table>
        <span style="display:inline-block;width:3em;height:3em;background:#eee;border:1px solid black;"></span>
        <br><a href="https://github.com/solawk/wtdraw" target="_blank">[GitHub]</a>
        <br><a href="https://boosty.to/solawk" target="_blank">[Boosty]</a>
      </div>
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
  </div>
</template>

<script>
import editorConfig from '../sightEditor/config';
import SightEditorMenu from '../components/sightEditor/SightEditorMenu.vue';
import LayersPanel from '../components/sightEditor/LayersPanel.vue';
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
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateCanvasSize);
    window.removeEventListener('wheel', this.onWheel);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
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
    },
    render() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawReference();
      this.drawGrid();
      this.drawCrosshair();
      this.drawStuff();
      this.drawArrows();
      this.drawGhost();
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
      // Для примера: пустая реализация, т.к. objects и логика добавления объектов не реализованы
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
    onPointerDown(e) {
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
    onPointerMove(e) {
      if (!this.isTransforming) return;
      const layer = this.getSelectedLayer();
      if (!layer) return;
      const rect = this.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const dx = (mx - this.transformStart.x) / (this.screenZoom * 2000);
      const dy = (my - this.transformStart.y) / (this.screenZoom * 2000);
      if (this.transformMode === 'move') {
        layer.shiftX = this.transformStart.shiftX + dx;
        layer.shiftY = this.transformStart.shiftY + dy;
      } else if (this.transformMode === 'resize-l') {
        layer.width = Math.max(0.05, this.transformStart.width - dx);
      } else if (this.transformMode === 'resize-r') {
        layer.width = Math.max(0.05, this.transformStart.width + dx);
      } else if (this.transformMode === 'resize-t') {
        layer.height = Math.max(0.05, this.transformStart.height - dy);
      } else if (this.transformMode === 'resize-b') {
        layer.height = Math.max(0.05, this.transformStart.height + dy);
      } else if (this.transformMode === 'resize-tl') {
        layer.width = Math.max(0.05, this.transformStart.width - dx);
        layer.height = Math.max(0.05, this.transformStart.height - dy);
      } else if (this.transformMode === 'resize-tr') {
        layer.width = Math.max(0.05, this.transformStart.width + dx);
        layer.height = Math.max(0.05, this.transformStart.height - dy);
      } else if (this.transformMode === 'resize-bl') {
        layer.width = Math.max(0.05, this.transformStart.width - dx);
        layer.height = Math.max(0.05, this.transformStart.height + dy);
      } else if (this.transformMode === 'resize-br') {
        layer.width = Math.max(0.05, this.transformStart.width + dx);
        layer.height = Math.max(0.05, this.transformStart.height + dy);
      }
      this.reference = layer.img;
      this.referenceSize = layer.size;
      this.referenceX = layer.shiftX;
      this.referenceY = layer.shiftY;
    },
    onPointerUp(e) {
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
      this.layers.push({
        id: layerId,
        name: 'Фото',
        img,
        width: baseWidth,
        height: baseHeight,
        shiftX: shiftX || 0,
        shiftY: shiftY || 0,
        opacity: 1
      });
      this.selectedLayerId = layerId;
      this.reference = img;
      this.referenceSize = size;
      this.referenceX = shiftX;
      this.referenceY = shiftY;
      this.referenceOpacity = 1;
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
      // Экспортируем в .blk по заданному формату
      let blk = '';
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
      blk += 'drawLines{\n';
      // Пример: экспортируем все линии (или другие объекты)
      // Здесь нужно добавить экспорт компонентов (линий и т.д.)
      blk += '}\n';
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
    // --- Свободное трансформирование ---
    onKeyDown(e) {
      if (e.altKey && (e.key === 'т' || e.key === 'T' || e.key === 'm' || e.key === 'M')) {
        this.freeTransform = true;
      }
    },
    onKeyUp(e) {
      if (!e.altKey || (e.key === 'т' || e.key === 'T' || e.key === 'm' || e.key === 'M')) {
        this.freeTransform = false;
        this.isTransforming = false;
        this.transformMode = null;
      }
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
      this.layers.push({ id: newId, name: 'Слой ' + (this.layers.length + 1), img: null, width: 1, height: 1, shiftX: 0, shiftY: 0, opacity: 1 });
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
</style>
