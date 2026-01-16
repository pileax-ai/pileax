<template>
  <o-common-dialog class="guide-dialog dialog-theme"
                   :ok="dialog.ok"
                   :show="dialog.type === 'guide'"
                   :content-style="style"
                   @close="onHide"
                   @ok="onOk"
                   show-cancel
                   show-ok>
    <header class="row justify-center items-center" v-touch-pan.prevent.mouse="onPan">
      <q-icon :name="dialog.icon || 'info'" />
    </header>
    <section class="content">
      <div class="title">
        {{ dialog.title }}
      </div>
      <div class="message" v-html="dialog.message"></div>
    </section>
  </o-common-dialog>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'

import OCommonDialog from 'core/components/dialog/OCommonDialog.vue'
import useDialog from 'core/hooks/useDialog'

const { dialog, onHide, onOk } = useDialog()
const pos = reactive({ x: 0, y: 0 })

const style = computed(() => {
  return {
    minWidth: '540px',
    maxWidth: '540px',
    padding: '0px',
    transform: `translate(${pos.x}px, ${pos.y}px)`
  }
})

const onPan = (evt: any) => {
  pos.x += evt.delta.x
  pos.y += evt.delta.y
}
</script>

<style lang="scss">
@import "./dialog-theme";
.guide-dialog {
}
</style>
