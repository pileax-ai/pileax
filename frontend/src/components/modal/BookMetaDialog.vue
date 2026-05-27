<template>
  <o-common-dialog class="book-meta-dialog dialog-theme"
                   :show="dialog.type === 'book-meta'"
                   :content-style="style"
                   @close="onHide">
    <header class="row justify-center items-center" v-touch-pan.prevent.mouse="onPan">
      <q-icon name="mdi-tune-variant" />
      <q-btn icon="close" class="close"
             v-close-popup dense round flat  />
    </header>
    <section class="content">
      <book-general :id="id" v-if="id" />
    </section>
  </o-common-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'

import OCommonDialog from 'core/components/dialog/OCommonDialog.vue'
import BookGeneral from 'components/book/book-meta/book-general.vue'

import useDialog from 'core/hooks/useDialog'

const { dialog, onHide } = useDialog()
const pos = reactive({ x: 0, y: 0 })

const style = computed(() => {
  return {
    minWidth: '720px',
    maxWidth: '1200px',
    padding: '0px',
    transform: `translate(${pos.x}px, ${pos.y}px)`
  }
})

const id = computed(() => dialog.value.id)

const onPan = (evt: any) => {
  pos.x += evt.delta.x
  pos.y += evt.delta.y
}

</script>

<style lang="scss">
@import "./dialog-theme";
.book-meta-dialog {
}
</style>
