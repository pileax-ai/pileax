<template>
  <section class="reader-side-service">
    <o-frame :src="src" />
  </section>
</template>

<script setup lang="ts">
import {computed, PropType} from 'vue';
import useBook from 'src/hooks/useBook';
import OFrame from 'core/page/section/OFrame.vue';

const props = defineProps({
  item: {
    type: Object,
    default: function () {
      return {};
    }
  }
});

const { keyword } = useBook();

const src = computed(() => {
  const url = props.item.url;
  return url?.replaceAll('{word}', keyword.value);
});
</script>

<style lang="scss">
.reader-side-service {

}
</style>
