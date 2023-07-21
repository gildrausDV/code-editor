<script setup lang="ts">
  import { ref, onMounted } from 'vue';

  window.electron.readFilesFromPath("/Users/dimitrijevujcic/Desktop/Dimitrije/Bachelor\'s_degree/code-editor/test-project");

  var filesRead:any = ref([]);

  function getFiles() {
    const files = window.electron.getFiles();
    
    for (let i = 0; i < files.length; ++i) {
      for (let j = i + 1; j < files.length; ++j) {
        if (files[j - 1].type === "file" && files[j].type === "directory") {
          var tmp = files[j - 1];
          files[j - 1] = files[j];
          files[j] = tmp;
        }
      }
    }
    
    filesRead.value = files;
  }

  onMounted(() => {
    getFiles();
  });

</script>

<template>
  <div class="project-explorer">
    <div class="project-explorer-header">PROJECT EXPLORER</div>
    <hr>
    <div class="project-structure">
      <!-- <Tree :value=""></Tree> -->
      <div v-for="file in filesRead" :key="file.name">
        <b-icon icon="chevron-right" font-scale="4"></b-icon> {{file.name}}
      </div>
    </div>
  </div>
</template>

<style scoped>
  .project-explorer {
    width: 100%;
    height: 100%;

    padding-top: 15px;
    padding-bottom: 15px;

    background-color: #41729F;

    font-family: 'Monaco', sans-serif;
    color: white;
  }

  .project-explorer-header {
    margin-left: 15px;
  }

  .project-structure {
    margin-left: 15px;
  }

</style>
