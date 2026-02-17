<template>
  <q-layout view="hHh Lpr lFf" class="o-layout layout-error">
    <q-header class="top-navi full-width">
      <simple-toolbar />
    </q-header>

    <q-page-container>
      <page403 />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import SimpleToolbar from '../full-page/toolbar/SimpleToolbar.vue'
import Page403 from 'pages/error/403.vue'
</script>

<style lang="scss">
$dheight:  80px;
$mheight:  60px;
.layout-error {
  .q-drawer {
    background: transparent!important;
  }

  .q-header {
    height: $dheight;
    background: transparent;
  }

  .base-toolbar {
    position: fixed;
    height: $dheight;
    z-index: 101;
    //background-image: linear-gradient(90deg, #131a43 5%, #131a43 100%) !important;
    //background: rgba(#131a43, 0.7) !important;
    background: rgba(#011213, 0.7) !important;
    backdrop-filter: blur(20px);
    transform: translateZ(0px);
  }

  .top-navi {
    position: fixed;
    background: transparent!important;
    z-index: 100;

    .q-toolbar {
      height: 100%;
    }
  }

  .q-page-container.blur {
    .page {
      filter: blur(60px);
    }
  }
}

.mobile {
  .layout-page {
    .q-header {
      height: $mheight !important;

      .q-toolbar {
        height: $mheight !important;
      }
    }
  }

  .o-toolbar-extra {
    padding-right: 9px;
    .q-btn {
      height: 32px !important;
      padding: 0px 12px !important;
      margin: 0px;
      min-height: unset;
    }
  }
}
</style>
