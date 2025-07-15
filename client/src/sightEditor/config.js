// Конфигурация редактора прицелов

export default {
  canvas: {
    width: 3840,
    height: 2160,
    background: '#fff',
  },
  positioning: {
    initialScreenPos: { x: 0, y: 0.1 }, // В sight-координатах
    initialScreenZoom: 1 / 1.21, // Масштаб
    gridSize: 0.1, // Размер клетки сетки в sight-координатах
  },
  mouse: {
    dragSensitivity: 2,
    pullSensitivity: 1.5,
  },
  tools: [
    {
      name: 'lines',
      label: 'Линии',
      icon: null, // путь к иконке или null
      enabled: true,
    },
    {
      name: 'quads',
      label: 'Квадраты',
      icon: null,
      enabled: true,
    },
  ],
  rules: {
    minScale: 0.1,
    maxScale: 10,
    defaultOpacity: 0.8,
    referenceOpacity: 0.5,
  },
  ui: {
    menuIslandRadius: '1em',
    menuIslandBg: '#fff',
    menuIslandBorder: '1px solid #000',
  },
  interaction: {
    enableDisclaimer: true,
    disclaimerKey: 'wtdraw-disclaimerClosed',
  },
}; 