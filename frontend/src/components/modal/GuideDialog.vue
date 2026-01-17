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
      <div class="message" v-html="dialog.message" v-if="isString(dialog.message)"></div>
      <div class="message row items-center" v-else>
        <template v-for="(item, index) in dialog.message" :key="index">
          <component :is="item.component"
                     v-bind="item.props"
                     v-if="item.type === 'component'" />
          <span v-else v-html="item.content"></span>
        </template>
      </div>
    </section>

    <template #left-actions>
      <q-checkbox v-model="noShowAgain"
                  :label="$t('noShowAgain')"
                  style="margin-left: -8px;"
                  @update:modelValue="onNoShowAgain"
                  v-if="key" />
    </template>
  </o-common-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

import OCommonDialog from 'core/components/dialog/OCommonDialog.vue'
import useDialog from 'core/hooks/useDialog'
import useGuide from 'src/hooks/useGuide'

const { dialog, onHide, onOk } = useDialog()
const { closeGuide } = useGuide()
const noShowAgain = ref(false)
const pos = reactive({ x: 0, y: 0 })

const style = computed(() => {
  return {
    minWidth: '540px',
    maxWidth: '540px',
    padding: '0px',
    transform: `translate(${pos.x}px, ${pos.y}px)`
  }
})

const key = computed(() => {
  return dialog.value.key
})

const isString = (value: unknown): boolean => {
  return typeof value === 'string'
}

const onPan = (evt: any) => {
  pos.x += evt.delta.x
  pos.y += evt.delta.y
}

const onNoShowAgain = () => {
  closeGuide(key.value)
}
</script>

<style lang="scss">
@import "./dialog-theme";
.guide-dialog {
}
</style>
