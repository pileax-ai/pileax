<template>
  <o-common-dialog class="tips-dialog"
                   :title="dialog.title"
                   :icon="dialog.icon || 'info'"
                   :show="dialog.type === 'tips'"
                   :show-ok="dialog.showOk"
                   :show-cancel="dialog.showCancel"
                   :content-style="style"
                   @close="onHide"
                   @ok="onOk" header>
    <section class="content">
      <div v-html="dialog.message"></div>
    </section>
  </o-common-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import OCommonDialog from 'core/components/dialog/OCommonDialog.vue'
import { isMobile } from 'core/hooks/useCommon'
import useDialog from 'core/hooks/useDialog'

const { dialog, onHide, onOk } = useDialog()

const style = computed(() => {
  return {
    minWidth: '400px',
    maxWidth: '400px',
    padding: '0px'
  }
})
</script>

<style lang="scss">
.tips-dialog {
  .dialog-content {
    padding: 24px 16px;

    .content {
      font-size: 1.1rem;
    }
  }
}
</style>
