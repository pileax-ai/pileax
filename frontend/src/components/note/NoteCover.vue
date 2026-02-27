<template>
  <header
    class="note-cover"
    v-if="currentNote.cover"
    :class="{ 'is-dragging': isDragging }"
    @mousedown="handleMouseDown"
  >
    <img
      :src="currentNoteCover"
      alt="cover"
      :style="{ objectPosition: `50% ${coverPosition}%` }"
    />

    <div class="cover-controls" :class="{ 'active': showManager }">
      <template v-if="!isDragging">
        <q-btn flat>
          {{ $t('note.cover.change') }}
          <q-menu v-model="showManager" class="pi-menu" :offset="[0, 4]">
            <note-cover-manager @cover="onCover" />
          </q-menu>
        </q-btn>
        <q-btn @click.stop="startReposition" flat>
          {{ $t('note.cover.reposition') }}
        </q-btn>
      </template>
      <template v-else>
        <q-btn @click.stop="savePosition" flat>
          {{ $t('save') }}
        </q-btn>
        <q-btn @click.stop="cancelReposition" flat>
          {{ $t('cancel') }}
        </q-btn>
      </template>
    </div>

    <div v-if="isDragging" class="drag-tip">
      {{ $t('note.cover.repositionDrag') }}
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount } from 'vue'
import useNote from 'src/hooks/useNote'
import NoteCoverManager from './note-cover-manager/index.vue'

const emit = defineEmits(['cover'])

const {
  currentNote,
  currentNoteCover,
  saveNote,
} = useNote()

const isDragging = ref(false)
const coverPosition = ref(50) // Default middle (50%)
const startY = ref(0)
const startPos = ref(50)
const tempPosition = ref(50) // Store original pos for cancel

const showManager = ref(false)

const onCover = (meta: Indexable) => {
  emit('cover', meta.cover)
  if (meta.type === 'remove' || meta.type === 'upload') {
    showManager.value = false
  }
}

const startReposition = () => {
  tempPosition.value = coverPosition.value
  isDragging.value = true
}

const handleMouseDown = (e: MouseEvent) => {
  if (!isDragging.value) return

  startY.value = e.clientY
  startPos.value = coverPosition.value

  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
}

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value) return

  const deltaY = e.clientY - startY.value
  // Sensitivity factor: adjust based on container height
  // Notion-like behavior: dragging down moves image down
  const sensitivity = 0.2
  const newPos = startPos.value - (deltaY * sensitivity)

  // Clamp value between 0 and 100
  coverPosition.value = Math.max(0, Math.min(100, newPos))
}

const handleMouseUp = () => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)
}

const savePosition = () => {
  isDragging.value = false
  saveNote({
    id: currentNote.value.id,
    styles: {
      ...currentNote.value.styles,
      coverPosition: coverPosition.value
    }
  })
}

const cancelReposition = () => {
  coverPosition.value = tempPosition.value
  isDragging.value = false
}

onBeforeMount(() => {
  coverPosition.value = currentNote.value.styles?.coverPosition || 50
})
</script>

<style lang="scss">
.note-cover {
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

  &.is-dragging {
    cursor: ns-resize; /* North-South resize cursor */
  }

  .cover-controls {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    gap: 2px;

    opacity: 0;
    visibility: hidden;
    transition: opacity 0.8s ease, visibility 0.8s ease;

    &.active {
      opacity: 1;
      visibility: visible;
    }
  }

  .drag-tip {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 4px 12px;
    border-radius: 4px;
    pointer-events: none;
  }

  .q-btn {
    min-height: unset;
    padding: 4px 16px;
    background: white;
    color: #666666;
    font-weight: normal;
  }
}
</style>
