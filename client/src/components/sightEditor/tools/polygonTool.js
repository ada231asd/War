// Логика инструмента 'Многоугольник' для sightEditor

// Мировые (sight) -> экранные (canvas)
export function sightToCanvas(sight, screenPos, screenZoom, canvasWidth, canvasHeight) {
  return {
    x: (sight.x - screenPos.x) * screenZoom * 2000 + canvasWidth / 2,
    y: (sight.y - screenPos.y) * screenZoom * 2000 + canvasHeight / 2,
  };
}

// Экранные (canvas) -> мировые (sight)
export function canvasToSight(canvasPt, screenPos, screenZoom, canvasWidth, canvasHeight) {
  return {
    x: (canvasPt.x - canvasWidth / 2) / (screenZoom * 2000) + screenPos.x,
    y: (canvasPt.y - canvasHeight / 2) / (screenZoom * 2000) + screenPos.y,
  };
}

// Добавление многоугольника в массив
export function addPolygon(polygons, newPolygon) {
  polygons.push({ ...newPolygon });
}

// Поиск ближайшей вершины среди всех многоугольников
export function findNearestVertex(polygons, mouseCanvas, screenPos, screenZoom, canvasWidth, canvasHeight, maxDist = 15) {
  let minDist = maxDist;
  let found = null;
  polygons.forEach((polygon, polyIdx) => {
    polygon.points.forEach((pt, pointIdx) => {
      const c = sightToCanvas(pt, screenPos, screenZoom, canvasWidth, canvasHeight);
      const dist = Math.sqrt((mouseCanvas.x - c.x) ** 2 + (mouseCanvas.y - c.y) ** 2);
      if (dist < minDist) {
        minDist = dist;
        found = { polyIdx, pointIdx, x: pt.x, y: pt.y };
      }
    });
  });
  return found;
}

// Отрисовка всех многоугольников (заливка чёрным)
export function drawPolygons(ctx, polygons, screenPos, screenZoom, canvasWidth, canvasHeight) {
  ctx.save();
  ctx.fillStyle = 'black';
  polygons.forEach(polygon => {
    if (polygon.points.length < 3) return;
    ctx.beginPath();
    const first = sightToCanvas(polygon.points[0], screenPos, screenZoom, canvasWidth, canvasHeight);
    ctx.moveTo(first.x, first.y);
    for (let i = 1; i < polygon.points.length; i++) {
      const pt = sightToCanvas(polygon.points[i], screenPos, screenZoom, canvasWidth, canvasHeight);
      ctx.lineTo(pt.x, pt.y);
    }
    ctx.closePath();
    ctx.fill();
  });
  ctx.restore();
}

// Отрисовка "призрака" строящегося многоугольника
export function drawGhostPolygon(ctx, points, ghost, screenPos, screenZoom, canvasWidth, canvasHeight) {
  if (!points || points.length === 0) return;
  ctx.save();
  ctx.setLineDash([8, 8]);
  ctx.globalAlpha = 0.5;
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  const first = sightToCanvas(points[0], screenPos, screenZoom, canvasWidth, canvasHeight);
  ctx.beginPath();
  ctx.moveTo(first.x, first.y);
  for (let i = 1; i < points.length; i++) {
    const pt = sightToCanvas(points[i], screenPos, screenZoom, canvasWidth, canvasHeight);
    ctx.lineTo(pt.x, pt.y);
  }
  if (ghost) {
    const g = sightToCanvas(ghost, screenPos, screenZoom, canvasWidth, canvasHeight);
    ctx.lineTo(g.x, g.y);
  }
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;
  ctx.restore();
} 