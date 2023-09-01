<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  import { highlightBash } from '../syntax-highlighting';

  const dirPath = defineProps(['dirPath']);

  const protectedContent = ref("");
  const editableContent = ref("");
  const lastTerminalOutput = ref<string>("");

  function handleInput(event: any) {
    editableContent.value = event.target.textContent;

    if (event.inputType === 'insertParagraph' ||
        event.data === null && event.inputType === 'insertText') {
      
      // @ts-ignore
      window.electron.sendCommand(editableContent.value + "\n");
      editableContent.value = "";
    }
  }

  onMounted(() => {
    // @ts-ignore
    window.electron.terminalIncomingData((_event: any, data: any) => {
      if (data === "" || data === "\r\n" || JSON.stringify(data) === "\r\n") 
        return;

      protectedContent.value += lastTerminalOutput.value;
      // protectedContent.value += highlightBash(lastTerminalOutput.value);
      lastTerminalOutput.value = data;

      // test
      const hc = highlightBash(protectedContent.value);
      console.log(hc);
      (document.getElementById("output") as HTMLDivElement).innerHTML = hc;
    });

    // @ts-ignore
    window.electron.sendCommand("\n");
  });

  watch(dirPath, (_newDirPath) => {
      if (dirPath.dirPath[0] === "")
        return;

      // @ts-ignore
      window.electron.sendCommand("cd " + dirPath.dirPath[0] + "\n");
  });

</script>

<template>
  <div class="terminal-container">
    <div class="terminal-output" id="output">
      <!-- {{ protectedContent }} -->
    </div>
    <div class="terminal">
      <div class="terminal-protected" contenteditable="false">{{ lastTerminalOutput }}</div>
      &nbsp;
      <div class="terminal-input" 
        contenteditable="true" 
        spellcheck="false"
        @input="handleInput">
          {{ editableContent }}
      </div>
    </div>
  </div>
</template>

<style scoped>

  .terminal-output {
    outline: none;
    color: white;
    font-family: 'Monaco', sans-serif;

    white-space: pre-wrap;
    overflow: auto;

    padding-left: 10px;
  }

  .terminal-protected {
    width: fit-content;
    outline: none;
    color: white;
    font-family: 'Monaco', sans-serif;
  }

  .terminal-input {
    width: 100%;
    outline: none;
    color: white;
    font-family: 'Monaco', sans-serif;
  }

  .terminal-container {
    width: 100%;
    height: 30%;

    background-color: black;
    border-top: 5px solid #C3E0E5;
    overflow: auto;
  }

  .terminal {
    width: 100%;
    height: 100%;

    outline: none;
    color: white;
    font-family: 'Monaco', sans-serif;

    padding-top: 5px;
    padding-left: 10px;

    overflow: auto;
    white-space: nowrap;

    display: flex;
  }

</style>