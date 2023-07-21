<script setup lang="ts">
  import ProjectExplorer from './ProjectExplorer.vue';
</script>

<template>
  <div class="code-editor-container">
    <div class="project-explorer-container">
      <ProjectExplorer/>
    </div>
    <div class="code-container">

    </div>
  </div>
</template>

<style scoped>
  .code-editor-container {
    width: 100%;
    height: 100%;

    display: flex;

    background-color: #C3E0E5;
  }

  .project-explorer-container {
    width: 20%;
    height: 100%;

    padding-right: 1px;
  }

  .code-container {
    width: 80%;
    height: 100%;
    background-color: #5885AF;
  }
</style>
