<template>
  <q-scroll-area class="o-book-desc" :class="{ 'expanded': expanded }">
    <div class="desc-content" v-html="desc"></div>

    <q-btn :icon="expanded ? 'mdi-arrow-collapse' : 'mdi-arrow-expand'"
           class="expand"
           flat round
           @click="onToggleExpand"
           v-if="expandable">
      <o-tooltip>
        {{ expanded ? $t('collapse') : $t('expand') }}
      </o-tooltip>
    </q-btn>
  </q-scroll-area>
</template>

<script setup lang="ts">
const props = defineProps({
  desc: { type: String, default: '' },
  expandable: { type: Boolean, default: false },
  expanded: { type: Boolean, default: false },
})
const emit = defineEmits(['update:expanded'])

function onToggleExpand() {
  emit('update:expanded', !props.expanded)
}
</script>

<style lang="scss">
.o-book-desc {
  height: 160px;
  text-align: justify;
  position: relative;

  h1 {
    font-size: 1.4rem;
  }
  h2 {
    font-size: 1.3rem;
  }
  h3 {
    font-size: 1.2rem;
    font-weight: 600;
    margin: 0;
  }

  .desc-content {
    white-space: pre-wrap;
    word-break: break-word;
    line-height: 1.75;
  }

  .expand {
    position: absolute;
    top: 0;
    right: 0;

    &:before {
      content: "";
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background-color: var(--q-info);
      opacity: 0.15;
    }
  }
}
</style>
