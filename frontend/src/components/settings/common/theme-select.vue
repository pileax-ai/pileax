<template>
  <section class="theme-select">
    <template v-for="(item, index) in themeList" :key="index">
      <div :class="`${itemClass}`">
        <q-btn :icon="`${item.value===theme.name ? 'done': ''}`"
               :class="`theme-${item.value}`"
               flat
               @click="setTheme(item.value)">
        </q-btn>
        <div class="text-center text-tips">
          {{$t(`appearances.themes.${item.value}`)}}
        </div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
const props = defineProps({
  itemClass: {
    type: String,
    default: ''
  }
})

import useSetting from 'core/hooks/useSetting'
const { themeList, theme, setTheme } = useSetting()

</script>

<style lang="scss">
.theme-select {
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


    &:before {
      content: "";
      position: absolute;
      width: 30%;
      height: 100%;
      border-radius: 3px 0 0 3px;
    }
  }

  .theme-light {
    background: #ffffff;
    border: solid 1px rgba(0, 0, 0, 0.1);
    border-radius: 3px !important;

    &:before {
      border-right: solid 1px #ffffff;
      background: #f5f7f9;
    }
  }


  .theme-dark {
    background: #1E1F22;
    border: solid 1px rgba(255, 255, 255, 0.1);

    &:before {
      border-right: solid 1px #2B2D30;
      background: #2B2D30;
    }
  }
}
</style>
