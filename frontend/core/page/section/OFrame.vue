<template>
  <section class="o-frame o-page-container">
    <div class="loading">
      <q-spinner-dots
          color="primary"
          size="3em"
          v-if="loading"
      />
    </div>
    <iframe :src="src"
            @load="onLoad">
    </iframe>
  </section>
</template>

<script setup lang="ts">
import {ref} from 'vue';
const props = defineProps({
  src: {
    type: String,
    default: ''
  }
});

const loading = ref(true);

function onLoad() {
  loading.value = false;
}
</script>

<style lang="scss">
.o-frame {
  .loading {
    position: absolute;
    left: 0;
    top: 100px;
    width: 100%;
    text-align: center;
  }

  iframe {
    width: 100%;
    height: 100%;

    box-sizing: border-box;
    overflow: hidden;
    border: 0;
  }
}
</style>
