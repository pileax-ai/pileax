<template>
  <q-page class="o-single-page">
    <q-scroll-area class="o-scrollarea-page">
      <header class="page-header-padding" v-if="header">
      </header>
      <section class="o-page-content" :class="contentClass">
        <template v-if="layout === 'wide'">
          <content-wide :class="layoutClass">
            <slot></slot>
          </content-wide>
        </template>
        <template v-else>
          <slot></slot>
        </template>
      </section>

      <page-footer v-if="footer" />
    </q-scroll-area>
  </q-page>
</template>

<script setup lang="ts">
import PageFooter from 'core/page/footer/PageFooter.vue';
import ContentWide from 'core/page/content/ContentWide.vue';

defineProps({
  header: {
    type: Boolean,
    default: false
  },
  footer: {
    type: Boolean,
    default: false
  },
  contentClass: {
    type: String,
    default: 'bg-accent'
  },
  layout: {
    type: String,
    default: ''
  },
  layoutClass: {
    type: String,
    default: ''
  },
  dialog: {
    type: Object,
    default: function () {
      return {
        side: true,
        show: false,
        title: '',
        style: {width: '375px'},
        action: false
      }
    }
  },
  sideFullScreen: {
    type: Boolean,
    default: false
  },
});
</script>

<style lang="scss">
.o-single-page {
  position: relative;
  .page-header-padding {
    height: 80px;
  }
  .o-page-content {
    min-height: calc(100vh - 484px);
  }
}
</style>
