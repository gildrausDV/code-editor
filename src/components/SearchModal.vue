<script setup lang="ts">
    import { ref, onMounted } from 'vue';

    const { isOpen } = defineProps(['isOpen']);
    const emit = defineEmits(['close-modal', 'search-next', 'search-prev', 'search-content']);
    const searchInput = ref<HTMLInputElement | null>(null);

    var searchFlag: boolean = false;

    function closeModal() {
        searchFlag = false;
        emit('close-modal');
    }

    function search() {
        searchFlag = true;
        emit('search-content', searchInput.value?.value);
    }

    function next() {
        emit('search-next');
    }

    function prev() {
        emit('search-prev');
    }

    onMounted(() => {
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                searchFlag ? next() : search();
                event.preventDefault();
            }
        });
    });

</script>

<template>
    <div>
        <!-- Modal -->
        <div v-if="isOpen" class="modal fade show" tabindex="-1" aria-labelledby="exampleModalLabel" aria-modal="true" role="dialog" style="display:block">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content search-modal-container">
                    <div class="modal-content search-modal-content">
                        <input ref="searchInput" class="word-search-input" type="text" maxlength="25">
                        <i class="bi bi-arrow-up search-option" @click="prev"></i>
                        <i class="bi bi-arrow-down search-option" @click="next"></i>
                        <i class="bi bi-x search-option" @click="closeModal"></i>
                    </div>
                    <!-- <div class="modal-header">
                        <button type="button" @click="closeModal" class="btn-close"></button>
                    </div>
                    <div class="modal-body search-modal-body">
                        <div>
                            Search word: <input ref="searchInput" class="word-search-input" type="text" maxlength="25">
                            <button class="btn btn-search" type="button" @click="search">Search</button>
                        </div>
                    </div>
                    <div class="modal-footer search-modal-footer">
                        <button class="btn btn-next" type="button" @click="next">Next</button>
                        <button class="btn btn-prev" type="button" @click="prev">Prev</button>
                    </div> -->
                </div>
            </div>
        </div>
    </div>
</template>
  
<style scoped>

    .search-option:hover {
        background-color: black;
        color: white;
        cursor: pointer;
        border-radius: 25px;
    }

    .search-modal-content {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        background-color: gray;
    }

    .word-search-input {
        border-radius: 5px;
        outline: none;
    }

    .search-modal-container {
        position: fixed;
        top: 0;
        right: 0;
        width: 350px;

        margin-top: 45px;
        margin-right: 75px;
    }

</style>