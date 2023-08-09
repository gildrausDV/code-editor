<script setup lang="ts">

    import { onMounted, ref, watch/*, computed*/ } from 'vue';
    import { syntaxHighlightingAndParsing } from '../syntax-highlighting';

    const { filesToDisplay } = defineProps(['filesToDisplay']);

    const numberOfLines = ref(1);
    const codeAreaRef = ref(null);
    const contentEditable = ref(false);

    var editedFilesToDisplay: boolean = false;
    var timeout: any = undefined;

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

    function getCaretPosition() {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const clonedRange = range.cloneRange();
            if (codeAreaRef.value) {
                clonedRange.selectNodeContents(codeAreaRef.value);
                clonedRange.setEnd(range.endContainer, range.endOffset);
                return clonedRange.toString().length;
            }
        }
        return 0;
    }

    function moveCursorToPosition(position: number) {
        const codeAreaRef = document.getElementById("code-area");
        if (!codeAreaRef?.textContent || position < 0) 
            return;

        const textNodes = getTextNodes(codeAreaRef);
        let offset = 0;

        for (let i = 0; i < textNodes.length; i++) {
            const node = textNodes[i];
            if (!node.textContent) 
                continue;
            const nodeLength = node.textContent.length;

            if (offset + nodeLength >= position) {
                const range = document.createRange();
                range.setStart(node, position - offset);
                range.collapse(true);

                const selection = window.getSelection();
                if (selection) {
                    selection.removeAllRanges();
                    selection.addRange(range);
                    break;
                }
            }
            offset += nodeLength;
        }
    }

    function getTextNodes(node: Node): Node[] {
        const textNodes: Node[] = [];

        if (node.nodeType === Node.TEXT_NODE) {
            textNodes.push(node);
        } else {
            const children = node.childNodes;
            for (let i = 0; i < children.length; i++) {
                textNodes.push(...getTextNodes(children[i]));
            }
        }

        return textNodes;
    }

    async function highlightCode(codeAreaRef: any, fileName: string) {
        if (codeAreaRef.value) {
            const position = getCaretPosition();
            const code = (codeAreaRef.value as HTMLDivElement).innerText;
            if (!code)
                return;
            
            const highlighted = await syntaxHighlightingAndParsing(code, fileName);
            if (highlighted)
                (codeAreaRef.value as HTMLDivElement).innerHTML = highlighted;
                
            moveCursorToPosition(position);
        }
    }

    function insertCharacterAtPosition(position: number, character: any) {
        const codeAreaRef = document.getElementById("code-area");
        if (!codeAreaRef || !codeAreaRef.textContent 
            || position < 0 || position > codeAreaRef.textContent.length) 
                return;

        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.collapse(true);

            const newNode = document.createTextNode(character);
            range.insertNode(newNode);

            range.setStartAfter(newNode);
            range.setEndAfter(newNode);

            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    function debounce() {
        if (timeout !== undefined)
            clearTimeout(timeout);

        timeout = setTimeout(() => {
            highlightCode(codeAreaRef, filesToDisplay[0].name);
        }, 500);
    }

    function handleInput(event: any) {
        refreshNumberOfLines();
        filesToDisplay[0].edited = true;
        editedFilesToDisplay = true;

        if (event.inputType === 'insertParagraph' && codeAreaRef.value) {
            insertCharacterAtPosition(getCaretPosition(), '\n');
        }

        // Highlight code 500ms after last input
        debounce();
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
            highlightCode(codeAreaRef, filesToDisplay[0].name);
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
            <code
                class="code-area"
                :contenteditable="contentEditable"
                ref="codeAreaRef"
                id="code-area"
                spellcheck="false"
                @input="handleInput"
                @keydown.tab.prevent="handleTabKey"
            >
                <!-- File content -->
            </code>
        </div>
        <div class="right-panel">
            <button class="btn btn-dark parse-button" @click="">A</button>
        </div>
    </div>
</template>

<style scoped>
    .parse-button {
        width: 40px;
    }

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
