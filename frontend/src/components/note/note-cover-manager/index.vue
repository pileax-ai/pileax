<template>
  <div class="note-cover-manager">
    <header class="row col-12 items-center justify-between">
      <div>
        <q-tabs v-model="currentTab"
                align="left"
                inline-label>
          <template v-for="(item, index) in tabs" :key="index">
            <q-tab :name="item.value" :label="item.label" />
          </template>
        </q-tabs>
      </div>
      <div>
        <q-btn label="Remove" class="text-readable" flat
               @click="emit('cover', {type: 'remove', cover: ''})" />
      </div>
    </header>


    <q-tab-panels v-model="currentTab"
                  class="bg-transparent"
                  keep-alive>
      <q-tab-panel name="gallery">
        <gallery-tab @cover="emit('cover', $event)" />
      </q-tab-panel>
      <q-tab-panel name="upload">
        <upload-tab @cover="emit('cover', $event)" />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount, computed } from 'vue'
import useNote from 'src/hooks/useNote'
import GalleryTab from './gallery-tab.vue'
import UploadTab from './upload-tab.vue'

const emit = defineEmits(['cover'])

const { currentNote } = useNote()
const currentTab = ref('gallery')

const tabs = computed(() => {
  return [
    {
      label: 'Gallery',
      value: 'gallery'
    },
    {
      label: 'Upload',
      value: 'upload'
    }
  ]
})
</script>

<style lang="scss">
.note-cover-manager {
  width: 600px;
  padding: 10px 0;

  header {
    padding: 0 10px;
    border-bottom: solid 1px var(--q-dark);
  }
  .q-tab, .q-btn {
    min-height: 30px;
    border-radius: 4px;
  }
  .q-tab-panel {
    //padding: 10px;
  }
}
</style>
