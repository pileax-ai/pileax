<template>
  <section class="fit reader-side">
    <ai-agent :item="item" v-if="item.type === 'ai'" />
    <web-service :item="item" v-else />
  </section>
</template>

<script setup lang="ts">
import {computed, PropType} from 'vue';
import AiAgent from './agent/ai-agent.vue';
import WebService from './service/web-service.vue';

const props = defineProps({
  item: {
    type: Object,
    default: function () {
      return {};
    }
  }
});
</script>

<style lang="scss">
.reader-side {
}
</style>
