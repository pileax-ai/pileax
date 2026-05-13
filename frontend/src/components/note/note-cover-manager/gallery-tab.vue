<template>
  <div class="gallery-tab">
    <section>
      <div class="group text-readable">Default</div>
      <section class="pi-view-grid">
        <template v-for="(item, key) in DefaultCovers" :key="key">
          <div class="">
            <cover-item :data="item" @click="onCover(item)" />
          </div>
        </template>
      </section>
    </section>
    <section v-if="uploadCovers.length">
      <div class="group text-readable">Uploaded</div>
      <section class="pi-view-grid">
        <template v-for="(item, key) in uploadCovers" :key="key">
          <div class="">
            <cover-item :data="item" @click="onCover(item)" v-close-popup />
          </div>
        </template>
      </section>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount, computed, onActivated } from 'vue'
import CoverItem from './cover-item.vue'
import { fileMetaService } from 'src/api/service/remote'

const emit = defineEmits(['cover'])

const DefaultCovers = [
  { label: 'Bubble Nebula', value: '/images/book/dark-bubble_nebula.jpg'},
  { label: 'Pillars of Creation', value: '/images/book/dark-pillars_of_creation.jpg'},
  { label: 'Old Book', value: '/images/book/light-old_book.jpg'},
  { label: 'Willow Bank', value: '/images/book/light-willow_bank.jpg'},
]
const uploadCovers = ref<Indexable>([])

const onCover = (item: Indexable) => {
  emit('cover', { type: 'gallery', cover: item.value })
}

const queryUploaded = () => {
  const body = {
    pageSize: 16,
    condition: {
      refType: 'note-cover',
      mimetype__icontains: 'image'
    }
  }
  fileMetaService.query(body).then(res => {
    uploadCovers.value = res.list.map((item: Indexable) => {
      return {
        label: item.originalName,
        value: item.url
      }
    })
  })
}

onActivated(() => {
  queryUploaded()
})
</script>

<style lang="scss">
.note-cover-manager .gallery-tab {
  //height: 600px;

  .group {
    padding: 10px 0 0 0;
  }

  .pi-view-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)) !important;
    gap: 10px;
  }
}
</style>
