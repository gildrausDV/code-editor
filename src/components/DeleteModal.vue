<script setup lang="ts">
    const { isOpen, deleteFileOrFolderPath } = defineProps(['isOpen', 'deleteFileOrFolderPath']);
    const emit = defineEmits(['confirm-delete', 'close-modal']);

    function closeModal() {
        emit('close-modal');
    }

    function confirm() {
        emit('confirm-delete', deleteFileOrFolderPath);
    }
</script>

<template>
    <div>
        <!-- Modal -->
        <div v-if="isOpen" class="modal fade show" tabindex="-1" aria-labelledby="exampleModalLabel" aria-modal="true" role="dialog" style="display:block">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content create-file-modal-container">
                    <div class="modal-header">
                        <button type="button" @click="closeModal" class="btn-close"></button>
                    </div>
                    <div class="modal-body create-file-modal-body">
                        <div>
                            Deleting file/folder on: {{ deleteFileOrFolderPath }}
                        </div>
                    </div>
                    <div class="modal-footer create-file-modal-footer">
                        <button class="btn" type="button" @click="confirm">Confirm</button>
                        <button class="btn" type="button" @click="closeModal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<style scoped>
    .create-file-modal-container {
        background-color: #41729F;
    }

    .create-file-modal-body {
        display: flex;
        justify-content: center;
    }

    .file-name-input {
        border-radius: 25px;
        width: 250px;
        text-align: center;
    }

    .create-file-modal-footer {
        display: flex;
        justify-content: center;
    }

    .create-file-modal-footer > .btn {
        border: 2px solid black;
        border-radius: 25px;
    }

</style>