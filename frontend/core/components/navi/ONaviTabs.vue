<template>
  <q-tabs ref="tabsRef"
          class="o-navi-tabs"
          swipeable
          no-caps
          mobile-arrows
          align="left"
          indicator-color="transparent">
    <slot></slot>
  </q-tabs>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { QTabs } from 'quasar'

const props = defineProps({
  showItemIcon: {
    type: Boolean,
    default: false
  }
})

const tabsRef = ref<InstanceType<typeof QTabs>>()

const onWheel = (e: WheelEvent) => {
  if (Math.abs(e.deltaX) > 0) {
    e.preventDefault()
    const el = tabsRef.value?.$el.querySelector('.q-tabs__content')
    el.scrollLeft += e.deltaX
  }
}

onMounted(() => {
  const el = tabsRef.value?.$el
  el?.addEventListener('wheel', onWheel, { passive: false })
})

onBeforeUnmount(() => {
  const el = tabsRef.value?.$el
  el?.removeEventListener('wheel', onWheel)
})
</script>

<style lang="scss">
.o-navi-tabs {
  .q-tab {
    position: relative;
    padding: 0;
    margin: 0 8px;
    border-radius: 1rem;

    .q-focus-helper {
      display: none;
    }
  }

  .q-tab__content {
    padding: 0;
  }

  .q-tabs__arrow {
    min-width: 100px;

    &--left {
      justify-content: start;
      left: -20px !important;
      background: linear-gradient(to right, var(--q-secondary), transparent);
    }
    &--right {
      justify-content: end;
      right: -20px !important;
      background: linear-gradient(to right, transparent, var(--q-secondary));
    }
  }
}
</style>
