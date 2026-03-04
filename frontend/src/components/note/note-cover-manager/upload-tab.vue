<template>
  <div class="upload-tab">
    <o-file-uploader accept=".jpg,.jpeg,.png,.svg"
                     :max-size="10*1024*1024"
                     :ref-id="currentNote.id"
                     ref-type="note-cover"
                     @uploaded="onUploaded" />
  </div>
</template>

<script setup lang="ts">
import useNote from 'src/hooks/useNote'
import OFileUploader from 'core/components/fIle/OFileUploader.vue'

const emit = defineEmits(['cover'])

const {
  currentNote,
  saveNote,
} = useNote()

const onUploaded = (meta: Indexable) => {
  emit('cover', { type: 'upload', cover: meta.path })
}
</script>

<style lang="scss">
.note-cover-manager .upload-tab {
}
</style>
