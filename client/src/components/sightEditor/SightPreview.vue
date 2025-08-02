<template>
  <div v-if="isVisible" class="preview-overlay" @click="handleOverlayClick">
    <div class="preview-window" @click.stop>
      <!-- Заголовок окна -->
      <div class="preview-header">
        <h3>Предпросмотр прицела</h3>
        <button class="close-btn" @click="closePreview" title="Закрыть">×</button>
      </div>
      
      <!-- Холст для отрисовки прицела -->
      <div class="preview-content">
        <canvas 
          ref="previewCanvas" 
          width="800" 
          height="600"
          class="preview-canvas"
        ></canvas>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SightPreview',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    layers: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      ctx: null,
      canvas: null
    };
  },
  watch: {
    isVisible(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.renderSight();
        });
      }
    },
    layers: {
      handler() {
        if (this.isVisible) {
          this.renderSight();
        }
      },
      deep: true
    }
  },
  methods: {
    // Преобразование координат как в основном холсте, но с фиксированным масштабом
    sightToCanvas(sight) {
      // Используем фиксированный масштаб для предпросмотра
      const fixedZoom = 0.2; // Фиксированный масштаб
      const fixedPos = { x: 0, y: 0.1 }; // Фиксированная позиция
      
      return {
        x: (sight.x - fixedPos.x) * fixedZoom * 2000 + 400,
        y: (sight.y - fixedPos.y) * fixedZoom * 2000 + 300,
      };
    },
    
    renderSight() {
      this.canvas = this.$refs.previewCanvas;
      this.ctx = this.canvas.getContext('2d');
      
      // Очищаем холст и устанавливаем белый фон
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.fillRect(0, 0, 800, 600);
      
      console.log('Предпросмотр: все слои:', this.layers);
      
      // Используем ту же логику, что и в основном холсте
      const linesLayer = this.layers.find(l => l.name === 'Линии');
      const polygonLayer = this.layers.find(l => l.name === 'Многоугольники');
      
      console.log('Предпросмотр: слой линий:', linesLayer);
      console.log('Предпросмотр: слой многоугольников:', polygonLayer);
      
      // Рисуем многоугольники (сначала) - как в drawStuff
      if (polygonLayer && polygonLayer.polygons && polygonLayer.polygons.length > 0) {
        console.log('Предпросмотр: многоугольники:', polygonLayer.polygons);
        this.ctx.globalAlpha = polygonLayer.opacity || 1.0;
        this.ctx.fillStyle = 'black';
        
        for (const poly of polygonLayer.polygons) {
          if (poly.points && poly.points.length >= 3) {
            console.log('Предпросмотр: рисуем многоугольник:', poly.points);
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
      }
      
      // Рисуем линии (поверх) - как в drawStuff
      if (linesLayer && linesLayer.lines && linesLayer.lines.length > 0) {
        console.log('Предпросмотр: линии:', linesLayer.lines);
        this.ctx.globalAlpha = linesLayer.opacity || 1.0;
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;
        
        for (const line of linesLayer.lines) {
          if (line.points && line.points.length > 1) {
            console.log('Предпросмотр: рисуем линию:', line.points);
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
      }
      
      // Восстанавливаем прозрачность
      this.ctx.globalAlpha = 1;
      
      // Рисуем центральные линии
      this.ctx.strokeStyle = 'black';
      this.ctx.lineWidth = 2;
      this.ctx.setLineDash([5, 5]); // Пунктирная линия
      
      // Вертикальная центральная линия
      this.ctx.beginPath();
      this.ctx.moveTo(400, 0);
      this.ctx.lineTo(400, 600);
      this.ctx.stroke();
      
      // Горизонтальная центральная линия
      this.ctx.beginPath();
      this.ctx.moveTo(0, 300);
      this.ctx.lineTo(800, 300);
      this.ctx.stroke();
      
      this.ctx.setLineDash([]); // Убираем пунктир
    },
    
    handleOverlayClick() {
      this.closePreview();
    },
    
    closePreview() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.preview-window {
  background: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  width: 800px;
  height: 600px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.preview-header {
  background: #23272f;
  color: #FFFFFF;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #444;
}

.preview-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.close-btn {
  background: #ff4444;
  color: #FFFFFF;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.close-btn:hover {
  background: #cc3333;
}

.preview-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-canvas {
  border: 1px solid #ddd;
  background: #FFFFFF;
}
</style> 