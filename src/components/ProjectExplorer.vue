<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import ProjectExplorerFolder from './ProjectExplorerFolder.vue'
  import CreateFileModal from './CreateFileModal.vue';
  import CreateFolderModal from './CreateFolderModal.vue';

  const emit = defineEmits([
    'add-tab'
  ]);

  const filesToDisplay = ref<any>([]);
  const isOpenCreateFileModal = ref<boolean>(false);
  const isOpenCreateFolderModal = ref<boolean>(false);
  const dirPath = ref(""); // "/Users/dimitrijevujcic/Desktop/Dimitrije/Bachelor\'s_degree/code-editor";
  const createFileOrFolderPath = ref("");

  function processFilesAndFolders(filesAndFolders: any) {
    const children = filesAndFolders.children;
    
    for(let i = 0; i < children.length; ++i) {
      if (children[i].type === 'directory') {
        processFilesAndFolders(children[i]);
      }
    }

    for(let i = 0; i < children.length; ++i) {
      for (let j = 1; j < children.length; ++j) {
        if (children[j - 1].type === 'file' && children[j].type === 'directory') {
          var tmp = children[j - 1];
          children[j - 1] = children[j];
          children[j] = tmp;
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
      filesToDisplay.value.opened = true;
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

  function openCreateFileModal(path: string | undefined) {
    isOpenCreateFileModal.value = true;
    if (!path) return;
    createFileOrFolderPath.value = path;
  }

  function openCreateFolderModal(path: string | undefined) {
    isOpenCreateFolderModal.value = true;
    if (!path) return;
    createFileOrFolderPath.value = path;
  }

  function createFile(fileName: string | undefined) {
    var path = createFileOrFolderPath.value;
    isOpenCreateFileModal.value = false;
    if (fileName === "" || path === undefined)
      return;

    path += "/" + fileName;

    // @ts-ignore
    window.electron.createFile(path).then(() => {
      console.log("Created file " + path);
      loadProject();
    }).catch((error: any) => {
      console.log("Error", error);
    });
  }

  function createFolder(folderName: string | undefined) {
    var path = createFileOrFolderPath.value;
    isOpenCreateFolderModal.value = false;
    if (folderName === "" || path === undefined)
      return;

    path += "/" + folderName;

    // @ts-ignore
    window.electron.createFolder(path).then(() => {
      console.log("Created folder");
      loadProject();
    }).catch((error: any) => {
      console.log("Error", error);
    });
  }

  onMounted(() => {
    loadProject();
  });

</script>

<template>
  
  <!-- Modals -->
  <CreateFileModal
    :isOpen="isOpenCreateFileModal"
    @confirm-file-name="createFile"
    @close-modal="isOpenCreateFileModal = false"
  />
  <CreateFolderModal
    :isOpen="isOpenCreateFolderModal"
    @confirm-folder-name="createFolder"
    @close-modal="isOpenCreateFolderModal = false"
  />

  <div class="project-explorer">
    <div class="project-explorer-header">PROJECT EXPLORER</div>
    <hr>
    <div v-if="dirPath !== ''" class="project-structure">
      <ProjectExplorerFolder
          v-if="filesToDisplay.type === 'directory'"
          :folder="filesToDisplay"
          @add-tab="openFile"
          @reload-project="loadProject"
          @open-create-file-modal="openCreateFileModal"
          @open-create-folder-modal="openCreateFolderModal"
        />
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
