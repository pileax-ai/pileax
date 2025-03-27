<template>
  <section class="row o-app-download">
    <q-btn flat @click="onDownload('apple')">
      <img src="images/download/app-store.svg" />
      <o-tooltip class="bg-indigo" position="top">
        App Store
      </o-tooltip>
    </q-btn>
    <q-btn flat @click="onDownload('google')">
      <img src="images/download/google-play.svg" />
      <o-tooltip class="bg-indigo" position="top">
        Google Play
      </o-tooltip>
    </q-btn>
    <q-btn flat @click="onDownload('apk')">
      <img :src="apkImg" />
      <o-tooltip class="bg-indigo" position="top">
        {{ $t('download') }} APK
      </o-tooltip>
    </q-btn>
    <o-hover-menu anchor="top middle" self="bottom middle" :offset="[0, 10]">
      <template #trigger>
        <img src="images/download/qr-code.svg" />
      </template>
      <div class="q-px-sm q-pt-sm">
        <vue-qrcode value="https://aiboost.im" :options="{ width: 160 }" />
      </div>
    </o-hover-menu>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import VueQrcode from '@chenfengyuan/vue-qrcode';
import OHoverMenu from 'core/components/menu/OHoverMenu.vue';

const platform = ref('android');
const modal = ref(false);
const apkImg = ref('');

function onDownload(type :string) {
  console.log('download', type)
}

</script>

<style lang="scss">
.o-app-download {
  .q-btn {
    margin-right: 10px;
    padding: 0;
  }

  img {
    display: block
  }

  .pending {
    filter: grayscale(100%);
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -o-filter: grayscale(100%);
  }
}
</style>
