<template>
  <o-common-dialog class="tips-dialog dialog-theme"
                   :show="dialog.type === 'tips'"
                   :content-style="style"
                   @close="onHide"
                   @ok="onOk"
                   show-cancel
                   show-ok>
    <header class="row justify-center items-center" v-touch-pan.prevent.mouse="onPan">
      <o-icon :name="dialog.icon || 'info'" />
    </header>
    <section class="content">
      <div class="title">
        {{ dialog.title }}
      </div>
      <div class="message" v-html="dialog.message" v-if="isString(dialog.message)"></div>
      <div class="message row items-center" v-else>
        <template v-for="(item, index) in dialog.message" :key="index">
          <component
            v-if="item.type === 'component'"
            :is="item.component"
            v-bind="item.props"
          />
          <span v-else v-html="item.content"></span>
        </template>
      </div>
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

const isString = (value: unknown): boolean => {
  return typeof value === 'string'
}

const onPan = (evt: any) => {
  pos.x += evt.delta.x
  pos.y += evt.delta.y
}
</script>

<style lang="scss">
@import "./dialog-theme";
.tips-dialog {
}
</style>
