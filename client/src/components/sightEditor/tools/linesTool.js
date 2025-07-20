// Логика инструмента 'Линии' для sightEditor

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

// Добавление линии в массив
export function addLine(lines, newLine) {
  lines.push({ ...newLine });
}

// Поиск ближайшей вершины среди всех линий
export function findNearestVertex(lines, mouseCanvas, screenPos, screenZoom, canvasWidth, canvasHeight, maxDist = 15) {
  let minDist = maxDist;
  let found = null;
  lines.forEach((line, lineIdx) => {
    line.points.forEach((pt, pointIdx) => {
      const c = sightToCanvas(pt, screenPos, screenZoom, canvasWidth, canvasHeight);
      const dist = Math.sqrt((mouseCanvas.x - c.x) ** 2 + (mouseCanvas.y - c.y) ** 2);
      if (dist < minDist) {
        minDist = dist;
        found = { lineIdx, pointIdx, x: pt.x, y: pt.y };
      }
    });
  });
  return found;
} 