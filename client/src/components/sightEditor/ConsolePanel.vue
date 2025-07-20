<template>
  <div class="console-panel">
    <h3>Консоль объектов</h3>
    <div class="console-log">
      <div v-for="(entry, idx) in log" :key="idx" class="console-entry">
        <div class="console-meta">[{{ entry.type }}] {{ entry.settings }}</div>
        <pre class="console-svg">{{ entry.svg }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConsolePanel',
  props: {
    log: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.console-panel {
  background: #181818;
  color: #e0e0e0;
  border-left: none;
  border-top: 1px solid #333;
  padding: 10px 18px 10px 18px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  font-family: 'Fira Mono', 'Consolas', monospace;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  overflow-x: auto;
  overflow-y: hidden;
}
.console-log {
  display: flex;
  flex-direction: row;
  gap: 24px;
  width: 100%;
}
.console-entry {
  min-width: 220px;
  max-width: 340px;
  margin-right: 12px;
  padding-bottom: 4px;
  border-right: 1px solid #333;
  border-bottom: none;
  margin-bottom: 0;
}
.console-meta {
  font-size: 14px;
  color: #8be9fd;
  margin-bottom: 4px;
}
.console-svg {
  background: #222;
  color: #50fa7b;
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 13px;
  white-space: pre;
  overflow-x: auto;
  max-width: 300px;
}
</style> 