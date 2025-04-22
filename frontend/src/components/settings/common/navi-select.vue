<template>
  <section class="navi-select">
    <template v-for="(item, index) in NAVI_LAYOUTS" :key="index">
      <div :class="`${itemClass}`">
        <q-btn :icon="`${item.value === navi.layout ? 'done': ''}`"
               :class="`navi-layout-${item.value}`"
               flat
               @click="setNavi('layout', item.value)">
          <section class="items">
            <div class="item"></div>
            <div class="item"></div>
            <div class="item"></div>
          </section>
        </q-btn>
        <div class="text-center text-tips">
          {{item.label}}
        </div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { NAVI_LAYOUTS } from 'core/constants/setting';
import useSetting from 'core/hooks/useSetting';

defineProps({
  itemClass: {
    type: String,
    default: ''
  }
});

const { navi, setNavi } = useSetting();
</script>

<style lang="scss">
.navi-select {
  .q-btn {
    color: var(--q-primary);
    width: 80px;
    height: 40px;
    min-height: unset;
    padding: 0;
    border-radius: 3px;

    .q-icon {
      font-size: 18px;
    }

    .items {
      position: absolute;
      padding: 2px;
    }

    .item {
      width: 10px;
      height: 10px;
      background: #dddddd;
      border-radius: 2px;
      margin: 1px;
    }
  }

  .navi-layout-group {
    background: #f5f7f9;

    .items {
      left: 2px;
    }
  }

  .navi-layout-tab {
    background: #f5f7f9;

    .items {
      top: 2px;
      left: 2px;
      display: flex;
    }
  }
}
</style>
