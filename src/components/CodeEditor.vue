<script setup lang="ts">
  import CodeArea from './CodeArea.vue';
  import ProjectExplorer from './ProjectExplorer.vue';
  import TabContainer from './TabContainer.vue';
  import Terminal from './Terminal.vue';
  import { ref } from 'vue';

  const openTabs = ref<any[]>([]);
  const filesToDisplay = ref<any[]>([]);

  function addTab(file: any) {
    openTabs.value.push(file);

    // If only one tab, load it in code area
    if (openTabs.value.length === 1) {
      filesToDisplay.value.push(file);
    }
  }

  function removeTab(tab: any) {
    openTabs.value.splice(openTabs.value.indexOf(tab), 1);

    // Fix displayed file
    if (filesToDisplay.value[0] === tab) {
      filesToDisplay.value.pop();
      
      if (openTabs.value.length > 0) {
        filesToDisplay.value.push(openTabs.value[0]);
      }
    }
  }

  function loadFile(tab: any) {
    if (filesToDisplay.value.length > 0)
      filesToDisplay.value.splice(0, 1);
    filesToDisplay.value.push(tab);
  }

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
        @load-file="loadFile"
        @remove-tab="removeTab"
      />
      <CodeArea
        :files-to-display="filesToDisplay"
      />
      <Terminal/>
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
