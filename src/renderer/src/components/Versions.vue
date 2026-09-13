<template>
  <ul class="versions">
    <li>Electron v{{ versions.electron }}</li>
    <li>Chromium v{{ versions.chrome }}</li>
    <li>Node v{{ versions.node }}</li>
  </ul>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const versions = reactive({ ...window.electron.process.versions })
</script>

<style scoped>
.versions { display: flex; gap: 12px; padding: 0; color: #94a3b8; font-size: 12px; list-style: none; }
</style>
