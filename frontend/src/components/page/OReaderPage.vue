<template>
  <o-base-page class="o-reader-page full-width full-height"
          :style="`--reader-background-color: ${settings.backgroundColor};
                 --reader-background-image: url(${settings.backgroundImage});
                 --reader-background-repeat: ${settings.backgroundRepeat};
                 --reader-background-position: ${settings.backgroundPosition};
                 --reader-background-size: ${settings.backgroundSize};
                 --reader-background-blur: blur(${settings.backgroundBlur}px);
                 --reader-background-opacity: ${settings.backgroundOpacity};`">
    <q-scroll-area ref="contentScroll"
                   class="o-page-container fit"
                   :class="contentClass">
      <div class="overlay"></div>
      <slot></slot>
    </q-scroll-area>

    <div ref="footnoteDialog"
         id="footnote-dialog"
         class="footnote-dialog">
      <div>
        <main></main>
      </div>
    </div>
  </o-base-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import useReaderSetting from 'src/hooks/useReaderSetting'
import OBasePage from 'core/page/template/OBasePage.vue'

const props = defineProps({
  contentClass: {
    type: String,
    default: 'bg-accent'
  }
})

const { settings } = useReaderSetting()
const footnoteDialog: any = ref(null)
</script>

<style lang="scss">
.o-reader-page {
  background: var(--reader-background-color)!important;

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
      background-image: var(--reader-background-image) !important;
      background-repeat: var(--reader-background-repeat);
      background-position: var(--reader-background-position);
      background-size: var(--reader-background-size);
      filter: var(--reader-background-blur);
      opacity: var(--reader-background-opacity);
    }
  }

  &.fixed-layout.scroll-mode {
    .o-page-container .overlay {
      background-color: var(--q-accent);
    }
  }
}

#footnote-dialog {
  opacity: 0;
  visibility: hidden;
  position: absolute !important;
  margin: 0 !important;
  box-sizing: border-box;

  width: max-content;
  height: auto;
  min-width: 640px;
  min-height: 60px;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  background: var(--q-secondary) !important;
  user-select: none !important;

  transform-origin: left top;
  transition: opacity 0.1s ease;
  padding: 1rem 0;
  z-index: 99999;

  &.is-open {
    visibility: visible !important;
    animation: footnoteZoomIn 0.2s ease-out forwards;
  }
}

#footnote-dialog div {
  display: flex;
  flex-direction: column;
  height: 100%;
}

#footnote-dialog main {
  overflow: auto;
  flex: 1;
  width: 100%;
  height: 100%;
}

@keyframes footnoteZoomIn {
  from {
    opacity: 0;
    transform: translate(-50%, -10px) scale(0.5)
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0) scale(1)
  }
}
</style>
