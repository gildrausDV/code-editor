<script setup lang="ts">

    import { onMounted, ref, watch } from 'vue';

    const { filesToDisplay } = defineProps(['filesToDisplay']);

    const numberOfLines = ref(1);
    const codeAreaRef = ref(null);
    const contentEditable = ref(false);

    var editedFilesToDisplay: boolean = false;

    onMounted(() => {
        refreshNumberOfLines();

        window.addEventListener('keydown', (event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 's') {
                saveFile();
            }
        });
    });

    function refreshNumberOfLines() {
        if (!codeAreaRef.value)
            return;

        const height = parseFloat(window.getComputedStyle(codeAreaRef.value).height);
        numberOfLines.value = Math.floor(height / 22.5);
    }

    function handleInput(_event: any) {
        refreshNumberOfLines();
        //console.log(filesToDisplay[0]);
        filesToDisplay[0].edited = true;
        editedFilesToDisplay = true;
    }

    function handleTabKey(event: any) {
        if (!codeAreaRef.value)
            return;
        
        const tabCharacter = '\t';
        const selection = window.getSelection();
        const range = selection?.getRangeAt(0);

        if (range) {
            event.preventDefault();
            const tabNode = document.createTextNode(tabCharacter);
            range.insertNode(tabNode);
            range.setStartAfter(tabNode);
            range.setEndAfter(tabNode);
            selection?.collapseToEnd();
        }
    }

    function clearCodeArea() {
        if (!codeAreaRef.value)
            return;
        
        (codeAreaRef.value as HTMLDivElement).innerText = "";
        contentEditable.value = false;
    }

    function saveFile() {
        if (!codeAreaRef.value)
            return;
        
        // @ts-ignore
        window.electron.saveFileContent(
            filesToDisplay[0].path, 
            (codeAreaRef.value as HTMLDivElement).innerText
        );

        filesToDisplay[0].edited = false;
    }

    watch(filesToDisplay, async (newFilesToDisplay) => {
        if (editedFilesToDisplay) {
            editedFilesToDisplay = false;
            return;
        }

        if (newFilesToDisplay.length === 0) {
            clearCodeArea();
            return;
        }

        const fileToDisplay = newFilesToDisplay[0];
        try {
            // @ts-ignore
            const fileContent = await window.electron.loadFileContent(fileToDisplay.path);
            if (codeAreaRef.value) {
                (codeAreaRef.value as HTMLDivElement).innerText = fileContent;

                refreshNumberOfLines();
            }
            contentEditable.value = true;
        } catch (error) {
            console.error("Error occurred:", error);
        }
    });

</script>

<template>
    <div class="code-area-container">
        <div class="rows-and-code-container">
            <div class="rows">
                <div v-if="contentEditable" v-for="num in numberOfLines">{{ num }}</div>
            </div>
            <div class="code-area" 
                :contenteditable="contentEditable" 
                ref="codeAreaRef" 
                spellcheck="false"
                @input="handleInput"
                @keydown.tab.prevent="handleTabKey"
            >
                <!-- File content -->
            </div>
        </div>
        <div class="right-panel">

        </div>
    </div>
</template>

<style scoped>

    .rows-and-code-container {
        width: 100%;
        height: 100%;

        display: flex;

        overflow: auto;
    }

    .code-area-container {
        width: 100%;
        height: 98%;

        display: flex;
        overflow: auto;
    }

    .code-area {
        width: 100%;
        min-height: 100%;
        height: fit-content;

        outline: none;
        padding-left: 20px;
        padding-right: 10px;
        padding-top: 5px;
        padding-bottom: 5px;

        font-size: 15px;
        font-family: 'Fira Code', monospace;
        color: white;
        background-color: black;

        white-space: pre;
    }

    .rows {
        width: 50px;
        min-height: 100%;
        height: fit-content;
        background-color: #C3E0E5;

        display: flex;
        flex-direction: column;
        justify-content: left;
        align-items: center;

        padding-top: 5px;
        padding-bottom: 5px;

        font-size: 15px;
    }

    .right-panel {
        width: 50px;
        height: 100%;
        background-color: #C3E0E5;
    }

</style>
