<template>
  <header
    class="note-share-cover"
    v-if="currentNote.cover"
  >
    <img
      :src="currentNoteCover"
      alt="cover"
      :style="{ objectPosition: `50% ${coverPosition}%` }"
    />
  </header>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, type PropType, computed } from 'vue'
import useApi from 'src/hooks/useApi'

const props = defineProps({
  currentNote: {
    type: Object as PropType<Indexable>,
    default: () => {}
  },
})
const emit = defineEmits(['cover'])

const { getFileUrl } = useApi()
const coverPosition = ref(50) // Default middle (50%)


const currentNoteCover = computed(() => {
  const cover = props.currentNote.cover
  return cover?.startsWith('/image') ? cover : getFileUrl(cover)
})

onBeforeMount(() => {
  coverPosition.value = props.currentNote.styles?.coverPosition || 50
})
</script>

<style lang="scss">
.note-share-cover {
  position: relative;
  width: 100%;
  height: 280px;
  overflow: hidden;

  &:hover {
    .cover-controls {
      opacity: 1;
      visibility: visible;
    }
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Important: ensures image fills the area */
    display: block;
    user-select: none; /* Prevent text selection while dragging */
    pointer-events: none; /* Let the parent handle events during drag */
  }

}
</style>
