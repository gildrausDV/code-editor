<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  // @ts-ignore
  import { Terminal } from 'xterm';
  import 'xterm/css/xterm.css';

  const terminalContainer = ref(null);
  let term: any;

  onMounted(() => {
    term = new Terminal();
    term.open(terminalContainer.value);

    // Add event listener to capture user input
    term.onData((data: any) => {
      // Handle user input
      //term.write(data);
      // @ts-ignore
      window.electron.sendKeystroke(data);
    });
  });

  onUnmounted(() => {
    // Clean up when the component is unmounted
    term.dispose();
  });
</script>


<template>
  <div ref="terminalContainer" class="terminal-container"></div>
</template>
  
<style scoped>
  .terminal-container {
    width: 100%;
    height: 300px;
    /* Add any other styling you want for the terminal container */
  }
</style>
  