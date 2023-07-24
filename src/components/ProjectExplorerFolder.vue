<script setup lang="ts">
  const emit = defineEmits();

  defineProps({
    folder: Object
  });

  function toggleFolder(folder: any) {
    if (folder.type !== 'directory')
      return;
    
    folder.opened = !folder.opened;
  }

  function openFile(file: any) {
    //console.log("TEST: " + JSON.stringify(file));
    emit('add-tab', file);
  }
</script>

<template>
  <div>
    <div v-if="folder?.type === 'directory' && !folder?.opened" @click.stop="toggleFolder(folder)">
        <i class="bi bi-chevron-right"></i>
        {{folder?.name}}
    </div>
    <div v-if="folder?.type ==='directory' && folder?.opened" @click.stop="toggleFolder(folder)">
        <i class="bi bi-chevron-down"></i>
        {{folder?.name}}

        <div v-for="child in folder.children" class="project-explorer-file-name">
            <div v-for="_x in child.level">
                &nbsp;
            </div>
            <ProjectExplorerFolder
                v-if="child['type'] === 'directory'"
                :folder="child"
                @add-tab="openFile"
            />
            <div v-else @click.stop="toggleFolder(child)" @dblclick="openFile(child)">
                {{ child['name'] }}
            </div>
        </div>
    </div>
    <div v-if="folder?.type === 'file'" @dblclick="openFile(folder)">
        {{folder?.name}}
    </div>
  </div>
</template>

<style scoped>

    .project-explorer-file-name {
        display: flex;
    }

</style>
