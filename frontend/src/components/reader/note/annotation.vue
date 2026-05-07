<template>
  <o-sheet v-model="show"
           :title="$t('book.refInfo')"
           @update:modelValue="emit('update:modelValue', $event)">
    <o-simple-form content-class="q-pa-md" style="min-height: 200px;">
      {{ note.title }}
    </o-simple-form>
  </o-sheet>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

import OSheet from 'core/components/dialog/OSheet.vue'
import OSimpleForm from 'core/page/section/OSimpleForm.vue'
import useBookNote from 'src/hooks/useBookNote'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:modelValue'])

const {
  note,
  noteId,
} = useBookNote()
const show = ref(false)


watch(() => props.modelValue, () => {
  show.value = props.modelValue
})


onMounted(() => {
  show.value = props.modelValue
})
</script>

<style lang="scss">
.book-note-meta {
  border-radius: 12px;
}
</style>
