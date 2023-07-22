<script setup lang="ts">

    const { openTabs } = defineProps(['openTabs']);

    function openFile(_tab: any) {
        
    }

</script>

<template>
  <div class="tab-container">
    <div v-for="tab in openTabs" class="tab" @click="openFile(tab)">
        {{ tab.name }}
    </div>
  </div>
</template>

<style scoped>

  .tab-container {
    width: 100%;
    height: 30px;

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
