<template>
  <div class="o-editable-label"
       ref="labelRef"
       :contenteditable="editing"
       @click="startEdit"
       @blur="stopEdit"
       @keydown.enter.prevent="stopEdit">
    {{ text }}
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  editable: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:modelValue'])

const labelRef = ref<HTMLElement | null>(null)
const editing = ref(false)

const text = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const startEdit = async () => {
  if (!props.editable) return

  editing.value = true
  await nextTick()
  labelRef.value?.focus()
}

const stopEdit = () => {
  editing.value = false
  text.value = labelRef.value?.innerText.trim() || ''
}
</script>

<style lang="scss">
.o-editable-label {
  position: relative;
  display: inline-flex;
  cursor: text;

  &:focus {
    outline: none;
  }

  &[contenteditable="true"]::before {
    content: '';
    position: absolute;
    inset: -4px;
    border: 2px solid var(--q-primary);
    border-radius: 4px;
    pointer-events: none;
  }
}
</style>
