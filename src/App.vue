<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// Simple App.vue without layout complications
</script>

<style lang="scss">
#q-app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  background: #f5f5f5;
}

body {
  margin: 0;
  padding: 0;
}
</style>