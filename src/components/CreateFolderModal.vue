<script setup lang="ts">
    import { ref } from 'vue';

    const { isOpen } = defineProps(['isOpen']);
    const emit = defineEmits(['confirm-folder-name', 'close-modal']);
    const folderNameInput = ref<HTMLInputElement | null>(null);

    function closeModal() {
        emit('close-modal');
    }

    function confirm() {
        if (folderNameInput.value) {
            const fileName = folderNameInput.value.value;
            emit('confirm-folder-name', fileName);
        }
    }
</script>

<template>
    <div>
        <!-- Modal -->
        <div v-if="isOpen" class="modal fade show" tabindex="-1" aria-labelledby="exampleModalLabel" aria-modal="true" role="dialog" style="display:block">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content create-folder-modal-container">
                    <div class="modal-header">
                        <button type="button" @click="closeModal" class="btn-close"></button>
                    </div>
                    <div class="modal-body create-folder-modal-body">
                        <div>
                            Folder name: <input ref="folderNameInput" class="folder-name-input" type="text" maxlength="25">
                        </div>
                    </div>
                    <div class="modal-footer create-folder-modal-footer">
                        <button class="btn" type="button" @click="confirm">Confirm</button>
                        <button class="btn" type="button" @click="closeModal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<style scoped>
    .create-folder-modal-container {
        background-color: #41729F;
    }

    .create-folder-modal-body {
        display: flex;
        justify-content: center;
    }

    .folder-name-input {
        border-radius: 25px;
        width: 250px;
        text-align: center;
    }

    .create-folder-modal-footer {
        display: flex;
        justify-content: center;
    }

    .create-folder-modal-footer > .btn {
        border: 2px solid black;
        border-radius: 25px;
    }

</style>