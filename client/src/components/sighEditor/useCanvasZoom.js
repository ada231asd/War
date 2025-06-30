import { ref } from 'vue'

export function useCanvasZoom() {
  const scale = ref(1)
  const minScale = 0.5
  const maxScale = 3.5
  const baseWidth = 800
  const baseHeight = 400
  const actions = ref([])
  const lastAction = ref(null)
  const lastActionCount = ref(1)

  function drawGridAndCross(canvas) {
    if (!canvas) return
    const width = baseWidth * scale.value
    const height = baseHeight * scale.value
    canvas.width = width
    canvas.height = height
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, width, height)
    ctx.save()
    ctx.strokeStyle = '#bbb'
    ctx.lineWidth = 1 * scale.value
    const quadW = width / 2
    const quadH = height / 2
    const cellW = quadW / 10
    const cellH = quadH / 5
    for (let qx = 0; qx < 2; qx++) {
      for (let qy = 0; qy < 2; qy++) {
        const offsetX = qx * quadW
        const offsetY = qy * quadH
        for (let i = 1; i < 10; i++) {
          ctx.beginPath()
          ctx.moveTo(offsetX + i * cellW, offsetY)
          ctx.lineTo(offsetX + i * cellW, offsetY + quadH)
          ctx.stroke()
        }
        for (let j = 1; j < 5; j++) {
          ctx.beginPath()
          ctx.moveTo(offsetX, offsetY + j * cellH)
          ctx.lineTo(offsetX + quadW, offsetY + j * cellH)
          ctx.stroke()
        }
      }
    }
    ctx.restore()
    ctx.save()
    ctx.strokeStyle = '#111'
    ctx.lineWidth = 0.7 * scale.value
    ctx.beginPath()
    ctx.moveTo(width / 2, 0)
    ctx.lineTo(width / 2, height)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, height / 2)
    ctx.lineTo(width, height / 2)
    ctx.stroke()
    ctx.restore()
  }

  function onWheel(e, canvas) {
    if (!e.altKey) return
    e.preventDefault()
    window.scrollTo(0, 0)
    let delta = e.deltaY > 0 ? -0.1 : 0.1
    let newScale = scale.value + delta
    newScale = Math.max(minScale, Math.min(maxScale, newScale))
    if (newScale !== scale.value) {
      const actionType = newScale > scale.value ? 'Увеличение' : 'Уменьшение'
      const sign = newScale > scale.value ? '+' : '-'
      let msg = `${actionType}: ${sign}${newScale.toFixed(2)}x`
      if (lastAction.value === actionType) {
        lastActionCount.value++
        actions.value[0] = msg
      } else {
        lastAction.value = actionType
        lastActionCount.value = 1
        actions.value.unshift(msg)
        if (actions.value.length > 30) actions.value.length = 30
      }
      scale.value = newScale
      drawGridAndCross(canvas)
    }
  }

  function resetZoom(canvas) {
    scale.value = 1
    drawGridAndCross(canvas)
  }

  return {
    scale,
    minScale,
    maxScale,
    baseWidth,
    baseHeight,
    actions,
    lastAction,
    lastActionCount,
    drawGridAndCross,
    onWheel,
    resetZoom
  }
} 