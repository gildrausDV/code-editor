<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import ProjectExplorerFolder from './ProjectExplorerFolder.vue'

  const emit = defineEmits();

  const filesToDisplay = ref([]);
  const dirPath = ref(""); // "/Users/dimitrijevujcic/Desktop/Dimitrije/Bachelor\'s_degree/code-editor";

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

  function loadProject() {
    if (dirPath.value === "")
      return;
    
    // @ts-ignore
    window.electron.getFiles(dirPath.value).then((files: string) => {
      filesToDisplay.value = processFilesAndFolders(JSON.parse(files));
    }).catch((error: any) => {
      console.error("Error occurred: ", error);
      filesToDisplay.value = [];
    });
  }

  function chooseProject() {
    // @ts-ignore
    window.electron.openProject().then((path: string) => {
      dirPath.value = path;

      loadProject();
    }).catch((error: any) => {
      console.error("Error occurred: ", error);
    });
  }

  function openFile(file: any) {
    emit('add-tab', file);
  }

  onMounted(() => {
    loadProject();
  });

</script>

<template>
  <div class="project-explorer">
    <div class="project-explorer-header">PROJECT EXPLORER</div>
    <hr>
    <div v-if="dirPath !== ''" class="project-structure">
      <div v-for="file in filesToDisplay" :key="file['name']">
        <ProjectExplorerFolder
          v-if="file['type'] === 'directory'"
          :folder="file"
          @add-tab="openFile"
        />
        <div v-else @dblclick="$emit('add-tab', file)" class="hover-contrast">
          {{ file['name'] }}
        </div>
      </div>
    </div>
    <div v-else class="open-project">
      <button class="btn open-project-btn" @click="chooseProject">Open project</button>
    </div>
  </div>
</template>

<style scoped>

  #directoryInput {
    display: none;
  }
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

  .open-project {
    display: flex;
    justify-content: space-around;

    padding-left: 20px;
    padding-right: 20px;
  }

  .open-project-btn {
    border-radius: 25px;
    border: 2px solid black;
    background-color: #C3E0E5;
  }

</style>
