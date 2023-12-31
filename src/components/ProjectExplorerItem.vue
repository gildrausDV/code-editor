<script setup lang="ts">
  import { ref, onMounted } from 'vue';

  const emit = defineEmits([
    'add-tab',
    'open-create-file-modal',
    'open-create-folder-modal',
    'open-delete-modal',
    'reload-project'
  ]);

  const { folder } = defineProps({
    folder: Object
  });

  const showFolderOptions = ref<any>(undefined);

  function toggleFolder(folder: any) {
    if (folder.type !== 'directory')
      return;
    
    folder.opened = !folder.opened;
  }

  function openDeleteModal(path: string | undefined, event: Event) {
    if (event)
      event.stopPropagation();
    emit('open-delete-modal', path);
  }

  function openCreateFileModal(path: string | undefined, event: Event) {
    if (event)
      event.stopPropagation();
    emit('open-create-file-modal', path);
  }

  function openCreateFolderModal(path: string | undefined, event: Event) {
    if (event)
      event.stopPropagation();
    emit('open-create-folder-modal', path);
  }

  function openFile(file: any) {
    emit('add-tab', file);
  }

  onMounted(() => {
    if (folder?.level === 0) {
      folder.opened = true;
    }
  });

</script>

<template>
    <div v-if="folder?.type === 'directory' && !folder?.opened" @click.stop="toggleFolder(folder)" class="project-explorer-container">
      <div class="hover-contrast" 
        @mouseenter="showFolderOptions = folder" 
        @mouseleave="showFolderOptions = undefined">
        <div>
          <i class="bi bi-chevron-right"></i> 
          {{folder?.name}}
        </div>
        <div v-if="showFolderOptions === folder" class="folder-options">
          <div class="folder-options-item" @click="openDeleteModal(folder?.path, $event)">
            <i class="bi bi-trash"></i>
          </div>
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
            <div class="folder-options-item" @click="openDeleteModal(folder?.path, $event)">
              <i class="bi bi-trash"></i>
            </div>
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
            <ProjectExplorerItem
                v-if="child['type'] === 'directory'"
                :folder="child"
                @add-tab="openFile"
                @open-create-file-modal="openCreateFileModal"
                @open-create-folder-modal="openCreateFolderModal"
                @open-delete-modal="openDeleteModal"
                @reload-project="$emit('reload-project')"
            />
            <div v-else @click.stop="toggleFolder(child)" @dblclick="openFile(child)" class="hover-contrast" 
              @mouseenter="showFolderOptions = child" 
              @mouseleave="showFolderOptions = undefined">
              <div>
                {{child['name']}}
              </div>
              <div v-if="showFolderOptions === child" class="folder-options">
                <div class="folder-options-item" @click="openDeleteModal(child?.path, $event)">
                  <i class="bi bi-trash"></i>
                </div>
              </div>
            </div>
        </div>
    </div>
    <div v-if="folder?.type === 'file'" @dblclick="openFile(folder)" class="hover-contrast"
        @mouseenter="showFolderOptions = folder" 
        @mouseleave="showFolderOptions = undefined">
        <div>
          <i class="bi bi-chevron-down"></i> 
          {{folder?.name}}
        </div>
        <div v-if="showFolderOptions === folder" class="folder-options">
          <div class="folder-options-item" @click="openDeleteModal(folder?.path, $event)">
            <i class="bi bi-trash"></i>
          </div>
          <div class="folder-options-item" @click="openCreateFileModal(folder?.path, $event)">
            <i class="bi bi-file-earmark-plus"></i>
          </div>
          <div class="folder-options-item" @click="openCreateFolderModal(folder?.path, $event)">
            <i class="bi bi-folder-plus"></i>
          </div>
        </div>
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
