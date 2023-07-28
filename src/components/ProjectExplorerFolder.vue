<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import CreateFileModal from './CreateFileModal.vue';
  import CreateFolderModal from './CreateFolderModal.vue';

  const emit = defineEmits(['add-tab', 'reload-project']);

  const { folder } = defineProps({
    folder: Object
  });

  const showFolderOptions = ref<any>(undefined);
  const isOpenCreateFileModal = ref<boolean>(false);
  const isOpenCreateFolderModal = ref<boolean>(false);
  const dirPath = ref<string | undefined>(undefined);

  function toggleFolder(folder: any) {
    if (folder.type !== 'directory')
      return;
    
    folder.opened = !folder.opened;
  }

  function openFile(file: any) {
    emit('add-tab', file);
  }

  function openCreateFileModal(path: string | undefined, event: Event) {
    event.stopPropagation();
    isOpenCreateFileModal.value = true;
    dirPath.value = path;
  }

  function openCreateFolderModal(path: string | undefined, event: Event) {
    event.stopPropagation();
    isOpenCreateFolderModal.value = true;
    dirPath.value = path;
  }

  function createFile(fileName: string | undefined) {
    var path = dirPath.value;
    isOpenCreateFileModal.value = false;
    if (fileName === "" || path === undefined)
      return;

    path += "/" + fileName;

    // @ts-ignore
    window.electron.createFile(path).then(() => {
      console.log("Created file");
      emit('reload-project');
    }).catch((error: any) => {
      console.log("Error", error);
    });
  }

  function createFolder(folderName: string | undefined) {
    var path = dirPath.value;
    isOpenCreateFolderModal.value = false;
    if (folderName === "" || path === undefined)
      return;

    path += "/" + folderName;

    // @ts-ignore
    window.electron.createFolder(path).then(() => {
      console.log("Created folder");
      emit('reload-project');
    }).catch((error: any) => {
      console.log("Error", error);
    });
  }

  onMounted(() => {
    if (folder?.level === 0) {
      folder.opened = true;
    }
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

    <div v-if="folder?.type === 'directory' && !folder?.opened" @click.stop="toggleFolder(folder)" class="project-explorer-container">
      <div class="hover-contrast" 
        @mouseenter="showFolderOptions = folder" 
        @mouseleave="showFolderOptions = undefined">
        <div>
          <i class="bi bi-chevron-right"></i> 
          {{folder?.name}}
        </div>
        <div v-if="showFolderOptions === folder" class="folder-options">
          <div class="folder-options-item" @click="openCreateFileModal(folder?.path, $event)">
            <i class="bi bi-file-earmark-plus"></i>
          </div>
          <div class="folder-options-item" @click="openCreateFolderModal(folder?.path, $event)">
            <i class="bi bi-folder-plus"></i>
          </div>
        </div>
      </div>
    </div>
    <div 
      v-if="folder?.type ==='directory' && folder?.opened" 
      @click.stop="toggleFolder(folder)"
      class="project-explorer-item"
      >
        <div class="hover-contrast" 
          @mouseenter="showFolderOptions = folder" 
          @mouseleave="showFolderOptions = undefined">
          <div>
            <i class="bi bi-chevron-down"></i> 
            {{folder?.name}}
          </div>
          <div v-if="showFolderOptions === folder" class="folder-options">
            <div class="folder-options-item" @click="openCreateFileModal(folder?.path, $event)">
              <i class="bi bi-file-earmark-plus"></i>
            </div>
            <div class="folder-options-item" @click="openCreateFolderModal(folder?.path, $event)">
              <i class="bi bi-folder-plus"></i>
            </div>
          </div>
        </div>

        <div v-for="child in folder.children" class="project-explorer-file-name">
            <div v-for="_x in child.level">
                &nbsp;
            </div>
            <ProjectExplorerFolder
                v-if="child['type'] === 'directory'"
                :folder="child"
                @add-tab="openFile"
            />
            <div v-else @click.stop="toggleFolder(child)" @dblclick="openFile(child)" class="hover-contrast">
                {{ child['name'] }}
            </div>
        </div>
    </div>
    <div v-if="folder?.type === 'file'" @dblclick="openFile(folder)" class="hover-contrast">
        {{folder?.name}}
    </div>
</template>

<style scoped>

  .project-explorer-container {
    width: 100%;
  }

  .project-explorer-item {
    width: 100%;
  }

  .folder-options {
    width: 75px;
    display: flex;
    justify-content: space-around;
  }

  .project-explorer-file-name {
      display: flex;
      width: 100%;
  }

  .hover-contrast {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding-right: 25px;
  }

  .hover-contrast:hover {
    color: black;
  }

  .folder-options-item {
    width: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 25px;

    cursor: pointer;
  }

  .folder-options-item:hover {
    background-color: #C3E0E5;
  }

</style>
