<script setup lang="ts">

  const emit = defineEmits();
  
  const { openTabs } = defineProps(['openTabs']);

  function openFile(tab: any) {
      emit('load-file', tab);
  }

  function closeTab(tab: any) {
    emit('remove-tab', tab);
  }

</script>

<template>
  <div class="tab-container">
    <div v-for="tab in openTabs" class="tab" @click="openFile(tab)">
        {{ tab.name }}
        <div v-if="tab.edited">
          &nbsp;<i class="bi bi-circle-fill"></i>&nbsp;
        </div>
        <i class="bi bi-x close-btn" @click.stop="closeTab(tab)"></i>
    </div>
  </div>
</template>

<style scoped>

  .tab-container {
    width: 100%;
    height: 32px;

    background-color: #274472;

    display: flex;
    justify-content: left;
    align-items: center;

    padding-left: 5px;
  }

  .tab {
    display: flex;
    justify-content: center;
    align-items: center;

    border-radius: 25px;
    background-color: #C3E0E5;

    min-width: 150px;
    width: fit-content;

    padding-left: 5px;
    padding-right: 5px;
    margin: 1px;
    
    cursor: pointer;
    font-family: 'Monaco', sans-serif;
    color: black;
  }

  .tab:hover {
    background-color: #5885AF;
    color: white;
  }

</style>
