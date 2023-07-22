<script setup lang="ts">
  import ProjectExplorer from './ProjectExplorer.vue';
  import TabContainer from './TabContainer.vue';
  import { ref } from 'vue';

  const openTabs = ref<any[]>([]);

  function addTab(file: any) {
    openTabs.value.push(file);
  }

  // function removeTab(filePath: string) {
  //     openTabs.splice(openTabs.indexOf(filePath), 1);
  // }

</script>

<template>
  <div class="code-editor-container">
    <div class="project-explorer-container">
      <ProjectExplorer
        @add-tab="addTab"
      />
    </div>
    <div class="code-container">
      <TabContainer 
        :open-tabs="openTabs"
      />
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
