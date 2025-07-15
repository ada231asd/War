<template>
  <div class="editor-bg">
    <div class="editor-area" ref="editorArea">
      <canvas id="mainCanvas" ref="mainCanvas" :width="canvasWidth" :height="1080"></canvas>
      
      <div id="functionalMenu" class="menuIsland" style="left: 1em; top: 1em">
        <hr id="functionalMenuDragger" size="10px" style="background-color: lightgray">
        <span id="refUrlTitle"></span>: <input type="text" id="refUrl" value="">
        <button id="loadRefButton">Загрузить</button>
        <br>
        <span id="refFileTitle"></span>: <input type="file" id="refFile">
        <br>
        <span id="sizeRefTitle"></span>: <input type="number" id="refSize" value="1" step="0.1" style="width: 4em"><br>
        <span id="shiftRefTitle"></span>:
        <input type="number" id="refShiftX" value="0" step="0.01" style="width: 4em">
        <input type="number" id="refShiftY" value="0" step="0.01" style="width: 4em">
        <br>
        <span id="refOpacityTitle">Непрозрачность картинки</span>:<br><input id="refOpacityInput" type="range" value="0.5" min="0" max="1" step="0.01"><br>
        <br><br>
        <span id="saveFileNameTitle">Название файла</span>: <input type="text" id="saveFileName" value="sight"><br>
        <button id="saveButton">Сохранить в файл</button>
        <button id="loadButton">Загрузить из файла</button>
        <input type="file" id="loadButtonInput" style="display: none">
        <br>
        <button id="autosaveManually">Принудительно автосохранить</button><span id="saveIcon" style="display:inline-block;width:1em;height:1em;background:#ccc;vertical-align:middle;border-radius:2px;"></span>
        <br><br>
        <button id="exportButton">Экспортировать</button>
      </div>
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
      <div id="objectsMenu" class="menuIsland" style="right: 1em; top: 1em; max-height: 50%; display: flex; flex-direction: column">
        <hr id="objectsMenuDragger" size="10px" style="background-color: lightgray; margin: 0">
        <b id="objectsTitle">Объекты</b>
        <div id="objectsList"></div>
        <button id="clearButton">Очистить</button>
      </div>
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
  </div>
</template>

<script>
import editorConfig from '../sightEditor/config';
export default {
  name: 'SightEditorView',
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
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateCanvasSize);
    window.removeEventListener('wheel', this.onWheel);
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
      if (this.reference == null) return;
      const refAspectRatio = this.reference.width / this.reference.height;
      const from = this.v2disposSight2v2canvas({ x: (-this.referenceSize / 2) * refAspectRatio + this.referenceX, y: (-this.referenceSize / 2) + this.referenceY });
      const to = this.v2disposSight2v2canvas({ x: (this.referenceSize / 2) * refAspectRatio + this.referenceX, y: (this.referenceSize / 2) + this.referenceY });
      this.ctx.globalAlpha = this.referenceOpacity;
      try {
        this.ctx.drawImage(this.reference, from.x, from.y, to.x - from.x, to.y - from.y);
      } catch (e) {
        this.reference = null;
        alert('Картинка не найдена/не подходит!');
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
      if (e.button === 2) {
        this.dragging = true;
        this.lastDragPos = { x: e.clientX, y: e.clientY };
      }
      // ... остальная логика (если есть)
    },
    onPointerMove(e) {
      if (this.dragging) {
        const dx = (e.clientX - this.lastDragPos.x) / (this.screenZoom * 2000);
        const dy = (e.clientY - this.lastDragPos.y) / (this.screenZoom * 2000);
        this.screenPos.x -= dx;
        this.screenPos.y -= dy;
        this.lastDragPos = { x: e.clientX, y: e.clientY };
      }
      // ... остальная логика (если есть)
    },
    onPointerUp(e) {
      if (e.button === 2) {
        this.dragging = false;
      }
      // ... остальная логика (если есть)
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
  }
};
</script>

<style scoped>
body {
  background: #888;
}
.editor-bg {
  min-height: 100vh;
  background: #888;
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
  box-shadow: 0 0 40px #0004;
  border-radius: 1em;
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
</style>
