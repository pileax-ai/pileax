<template>
  <o-common-dialog class="image-viewer-dialog"
                   :title="dialog.title"
                   :icon="dialog.icon"
                   :show="dialog.type === 'image-viewer'"
                   :content-style="style"
                   @close="onHide"
                   @ok="onOk">
    <img :src="dialog.message" />

    <q-btn icon="close"
           class="absolute-right text-readable close"
           flat round v-close-popup />
  </o-common-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import OCommonDialog from 'core/components/dialog/OCommonDialog.vue';
import useDialog from 'core/hooks/useDialog';

const { dialog, onHide, onOk } = useDialog();

const style = computed(() => {
  return {
    // width: '80vw',
    // height: '80vh',
    padding: '0px'
  };
});
</script>

<style lang="scss">
.image-viewer-dialog {
  .dialog-card {
    max-width: unset !important;

    &:hover {
      .close {
        visibility: visible;
      }
    }
  }
  .dialog-content {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 !important;
    width: 100%;
    height: 100%;

    img {
      display: block;
      max-width: 100vw;
      max-height: 90vh;
      min-height: 80vh;
      width: auto;
      height: auto;
      margin: 0;
      padding: 0;
    }
  }

  .close {
    top: 10px;
    right: 10px;
    height: 42px!important;
    visibility: hidden;
  }
}
</style>
