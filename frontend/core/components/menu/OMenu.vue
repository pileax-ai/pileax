<template>
  <q-menu ref="menu"
          v-model="modelValue"
          @before-show="emit('before-show')">
    <div :style="{ minWidth: minWidth, maxWidth: maxWidth, maxHeight: '50vh' }">
      <q-list no-border link inset-delimiter>
        <slot></slot>
      </q-list>
    </div>
  </q-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { QMenu } from 'quasar'

defineProps({
  minWidth: { type: String, default: '240px' },
  maxWidth: { type: String, default: 'none' },
})
const emit = defineEmits(['before-show'])
const qMenuRef = ref<QMenu | null>(null)

const modelValue = defineModel<boolean>({ default: false })

const close = () => {
  modelValue.value = false
  console.log()
}

defineExpose({
  close
})
</script>

<style lang="scss">
.o-menu {
}
</style>
