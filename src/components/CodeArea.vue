<script setup lang="ts">

    import { onMounted, ref, watch/*, computed*/ } from 'vue';
    import { syntaxHighlightingAndParsing } from '../syntax-highlighting';
    import SearchModal from '../components/SearchModal.vue'

    const { filesToDisplay } = defineProps(['filesToDisplay']);

    const numberOfLines = ref(1);
    const codeAreaRef = ref(null);
    const contentEditable = ref(false);

    const isOpenSearchModal = ref<boolean>(false);

    const fileContent = ref("");

    var editedFilesToDisplay: boolean = false;
    var timeout: any = undefined;
    var contentBeforeSearchHighlighting: string | undefined = undefined;
    var currentSearchToken: number = -1;

    onMounted(() => {
        refreshNumberOfLines();

        window.addEventListener('keydown', (event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 's') {
                saveFile();
            } else if ((event.metaKey || event.ctrlKey) && event.key === 'f') {
                isOpenSearchModal.value = true;
            }
        });

        
    });

    function refreshNumberOfLines() {
        if (!codeAreaRef.value)
            return;

        const height = parseFloat(window.getComputedStyle(codeAreaRef.value).height);
        numberOfLines.value = Math.floor(height / 22.5);
    }

    function debounce() {
        if (timeout !== undefined) {
            clearTimeout(timeout);
        }

        refreshNumberOfLines();
        timeout = setTimeout(async () => {
            // console.log("Highlight ", fileContent.value);
            const hc = await syntaxHighlightingAndParsing(fileContent.value, filesToDisplay[0].name);
            // console.log("Finished highlighting");

            const position = getCaretPosition();
            if (codeAreaRef.value && hc)
                (codeAreaRef.value as HTMLDivElement).innerHTML = hc;
            moveCursorToPosition(position);
        }, 500);
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

    function handleInput(_event: any) {
        filesToDisplay[0].edited = true;

        if (codeAreaRef.value) {
            var txtCnt = (codeAreaRef.value as HTMLDivElement).textContent;
            if (txtCnt)
                fileContent.value = txtCnt;
        }
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

    async function highlightSearchedContent(searchWord: string) {
        contentBeforeSearchHighlighting = await syntaxHighlightingAndParsing(fileContent.value, filesToDisplay[0].name);
        if (!contentBeforeSearchHighlighting)
            contentBeforeSearchHighlighting = fileContent.value;

        const contentAfterSearchHighlighting = contentBeforeSearchHighlighting.replace(
            new RegExp(searchWord, 'gi'), 
            "<span class='search-highlight'>" + searchWord + "</span>"
        );
        if (codeAreaRef.value)
            (codeAreaRef.value as HTMLDivElement).innerHTML = contentAfterSearchHighlighting;
        
        searchNext();
    }

    function removeHighlightedSearchedContent() {
        if (codeAreaRef.value && contentBeforeSearchHighlighting)
            (codeAreaRef.value as HTMLDivElement).innerHTML = contentBeforeSearchHighlighting;
        currentSearchToken = -1;
    }

    function addCurrentSearchTokenHighlight() {
        if (codeAreaRef.value) {
            const searchCollection = (codeAreaRef.value as HTMLDivElement).getElementsByClassName('search-highlight');
            searchCollection.item(currentSearchToken)?.classList.add('current-search-token');
        }
    }

    function getNumberOfHighlightedWords() {
        if (codeAreaRef.value) {
            const searchCollection = (codeAreaRef.value as HTMLDivElement).getElementsByClassName('search-highlight');
            return searchCollection.length;
        }
        return 0;
    }

    function removeCurrentSearchTokenHighlight() {
        if (codeAreaRef.value) {
            const searchCollection = (codeAreaRef.value as HTMLDivElement).getElementsByClassName('search-highlight');
            searchCollection.item(currentSearchToken)?.classList.remove('current-search-token');
        }
    }

    function searchNext() {
        removeCurrentSearchTokenHighlight();
        currentSearchToken = (currentSearchToken + 1) % getNumberOfHighlightedWords();
        addCurrentSearchTokenHighlight();
    }

    function searchPrev() {
        removeCurrentSearchTokenHighlight();
        currentSearchToken = (currentSearchToken - 1) % getNumberOfHighlightedWords();
        addCurrentSearchTokenHighlight();
    }

    // @ts-ignore
    function scrollToLine(line: number) {
        document.getElementById("code-area-container")?.scroll({
            top: 22.5 * (line - 1),
            behavior: "smooth"
        });
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
            const file = await window.electron.loadFileContent(fileToDisplay.path);
            if (codeAreaRef.value) {
                fileContent.value = file;
                debounce();
            }
            contentEditable.value = true;
        } catch (error) {
            console.error("Error occurred:", error);
        }
    });

</script>

<template>
    <!-- Modals -->
    <SearchModal
        :isOpen="isOpenSearchModal"
        @search-content="highlightSearchedContent"
        @search-next="searchNext"
        @search-prev="searchPrev"
        @close-modal="isOpenSearchModal = false; removeHighlightedSearchedContent();"
    />

    <div class="code-area-container">
        <div class="rows-and-code-container" id="code-area-container">
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
                {{ fileContent }}
            </code>
        </div>
        <div class="right-panel">
            
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
        height: 68%;

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
