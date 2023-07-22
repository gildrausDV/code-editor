<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import ProjectExplorerFolder from './ProjectExplorerFolder.vue'

  const emit = defineEmits();

  const filesToDisplay = ref([]);

  const dirPath = "/Users/dimitrijevujcic/Desktop/Dimitrije/Bachelor\'s_degree/code-editor";

  function processFilesAndFolders(filesAndFolders: any) {
    filesAndFolders = filesAndFolders.children;

    for(let i = 0; i < filesAndFolders.length; ++i) {
      if (filesAndFolders[i].type === 'directory') {
        processFilesAndFolders(filesAndFolders[i]);
      }

      for (let j = i + 1; j < filesAndFolders.length; ++j) {
        if (filesAndFolders[j - 1].type === 'file' && filesAndFolders[j].type === 'directory') {
          var tmp = filesAndFolders[j - 1];
          filesAndFolders[j - 1] = filesAndFolders[j];
          filesAndFolders[j] = tmp;
        }
      }
    }
    
    return filesAndFolders;
  }


  function openFile(file: any) {
    emit('add-tab', file);
  }

  onMounted(() => {
    // @ts-ignore
    window.electron.getFiles(dirPath).then((files: string) => {
      filesToDisplay.value = processFilesAndFolders(JSON.parse(files));
    }).catch((error: any) => {
      console.error("Error occurred: ", error);
      filesToDisplay.value = [];
    })
  });

</script>

<template>
  <div class="project-explorer">
    <div class="project-explorer-header">PROJECT EXPLORER</div>
    <hr>
    <div class="project-structure">
      <div v-for="file in filesToDisplay" :key="file['name']">
        <ProjectExplorerFolder
          v-if="file['type'] === 'directory'"
          :folder="file"
          @add-tab="$emit('add-tab')"
        />
        <div v-else @dblclick="$emit('add-tab', file)">
          {{ file['name'] }}
        </div>
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

    user-select: none;
    overflow-y: auto;
  }

  .project-explorer-header {
    margin-left: 15px;
  }

  .project-structure {
    margin-left: 15px;
  }

</style>
