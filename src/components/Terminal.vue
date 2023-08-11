<script setup lang="ts">
  import { ref, onMounted } from 'vue';

  const terminalContent = ref("");
  const command = ref("");

  // @ts-ignore
  const ipcRenderer = window.electron.ipcRenderer;

  function moveCursorToEnd() {
      const el = document.getElementById("terminal");
      const range = document.createRange();
      const selection = window.getSelection();

      //range.selectNodeContents(el);
      range.collapse(false); // Collapse the range to the end
      selection?.removeAllRanges();
      selection?.addRange(range);

      el?.focus(); // Set focus back to the contenteditable div
    }

  function handleInput(event: any) {
    terminalContent.value = event.target.textContent;
    console.log(event);
    
    if (event.data !== null)
      command.value += event.data;
    
    if (event.inputType === 'insertParagraph' ||
      event.data === null && event.inputType === 'insertText') {
      console.log("COMMAND: " + command.value);
      // @ts-ignore
      window.electron.sendKeyStroke(command.value + "\n");

      const text = (document.getElementById("terminal") as HTMLDivElement).innerText;
      (document.getElementById("terminal") as HTMLDivElement).innerText = text.slice(0, -command.value.length - 2);
      moveCursorToEnd();
      command.value = "";
    }
  }

  function getCursorPosition() {
    const selection = window.getSelection();
        
    if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const startOffset = range.startOffset;
        
        return startOffset;
    }

    return -1;
  }

  function handleKeydown(event: any) {
    if (event.key === 'Backspace') {
      console.log("DELETE: ", event);
      //console.log("CURSOR: " + getCursorPosition() + " " + (document.getElementById("terminal") as HTMLDivElement).innerText.length);
      if (getCursorPosition() < (document.getElementById("terminal") as HTMLDivElement).innerText.length - command.value.length) {
        event.preventDefault();
      }
    }
  }

  onMounted(() => {
    // @ts-ignore
    window.electron.terminalIncomingData((_event: any, data: any) => {
      console.log(data);

      //terminalContent.value += data;
      //(document.getElementById("terminal") as HTMLDivElement).innerHTML += "<div class='protected-content'>" + data + "</div>";
      (document.getElementById("terminal") as HTMLDivElement).innerText += data;
      //(document.getElementById("terminal") as HTMLDivElement).innerHTML += "</div>";
      //(document.getElementById("terminal") as HTMLDivElement).innerHTML += "&nbsp;";
      moveCursorToEnd();
    });

    // @ts-ignore
    window.electron.sendKeyStroke("\n");
  });

</script>

<template>
  <div class="terminal-container">
    <div class="terminal" 
      id="terminal"
      contenteditable="true" 
      spellcheck="false"
      @input="handleInput"
      @keydown="handleKeydown">
        
    </div>
  </div>
</template>

<style scoped>

  .terminal-container {
    width: 100%;
    height: 30%;

    background-color: black;
    border-top: 5px solid #C3E0E5;
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
  }

</style>