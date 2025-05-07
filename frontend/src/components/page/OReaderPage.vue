<template>
  <q-page class="o-reader-page bg-secondary full-width full-height"
          :style="`--reader-background-color: ${settings.backgroundColor};
                 --reader-background-image: url(${settings.backgroundImage});
                 --reader-background-blur: blur(${settings.backgroundBlur}px)`">
    <q-scroll-area ref="contentScroll"
                   class="o-page-container fit"
                   :class="contentClass">
      <div class="overlay"></div>
      <slot></slot>
      <dialog ref="footnoteDialog"
              id="footnote-dialog"
              v-on-click-outside="onClickOutside">
        <div>
          <main></main>
        </div>
      </dialog>
    </q-scroll-area>
  </q-page>
</template>

<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref} from 'vue';
import { vOnClickOutside } from '@vueuse/components';
import useReaderSetting from 'src/hooks/useReaderSetting';

const props = defineProps({
  contentClass: {
    type: String,
    default: 'bg-accent'
  }
});

const { settings } = useReaderSetting();
const footnoteDialog = ref(null);

function onClickOutside() {
  footnoteDialog.value?.close();
}

function onDialogShow() {
  console.log('show');
}

function onDialogClose() {
  console.log('close');
}

onMounted(() => {
  footnoteDialog.value?.addEventListener('footnote-dialog-shown', onDialogShow);
  footnoteDialog.value?.addEventListener('close', onDialogClose);
})

onUnmounted(() => {
  footnoteDialog.value?.removeEventListener('footnote-dialog-shown', onDialogShow);
  footnoteDialog.value?.removeEventListener('close', onDialogClose);
})
</script>

<style lang="scss">
.o-reader-page {
  .o-page-wrapper {
    width: 100%;
  }

  .o-page-container {
    .q-scrollarea__content {
      width: 100%;
    }

    .overlay {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      //background-color: var(--reader-background-color)!important;
      background-image: var(--reader-background-image)!important;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      filter: var(--reader-background-blur);
    }
  }
}

#footnote-dialog {
  visibility: hidden;
  position: absolute !important;
  top: 50%;
  left: 50%;
  width: 80%;
  max-width: 720px;
  height: 160px !important;
  border: none;
  border-radius: 6px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  background: var(--q-secondary) !important;
  user-select: none !important;
  //transform: translate(-50%, -50%);
  transform: scale(0.5); /* 初始缩小 */
  transform-origin: center center;
  transition: opacity 0.1s ease;
  margin-top: -100px; /* 负值是对话框高度的一半，用于垂直居中 */
  margin-left: max(-40%, -360px); /* 负值是对话框宽度的一半，用于水平居中 */

  &::backdrop {
    background: rgba(0, 0, 0, 0.9);
  }
}

dialog[open] {
  visibility: visible !important;
  animation: zoomIn 0.2s ease-out forwards;
}

dialog:focus {
  outline: none !important;
}

#footnote-dialog div {
  display: flex;
  flex-direction: column;
  height: 100%;
}

#footnote-dialog main {
  overflow: auto;
  flex: 1;
}
</style>
