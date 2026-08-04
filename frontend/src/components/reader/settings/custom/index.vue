<template>
  <section class="custom-settings">
    <nav class="row col-12">
      <q-tabs v-model="currentTab"
              active-color="white"
              active-bg-color="cyan"
              indicator-color="transparent"
              content-class="pi-tabs"
              inline-label dense>
        <template v-for="(item, index) in tabs" :key="index">
          <q-tab :name="item.value">
            {{ item.label }}
          </q-tab>
        </template>
      </q-tabs>
    </nav>

    <q-tab-panels v-model="currentTab"
                  class="bg-transparent"
                  keep-alive>
      <template v-for="(item, index) in tabs" :key="index">
        <q-tab-panel :name="item.value" class="no-padding">
          <component :is="item.component" />
        </q-tab-panel>
      </template>
    </q-tab-panels>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import GlobalCss from './GlobalCss.vue'
import BookCss from './BookCss.vue'
import Options from './Options.vue'
import useCommon from 'core/hooks/useCommon'

defineProps({
  fixedLayout: {
    type: Boolean,
    default: false
  },
})

const { t } = useCommon()
const currentTab = ref('options')
const tabs = computed(() => {
  return [
    { label: t('options'), value: 'options', component: Options },
    { label: t('reading.setting.style.globalCss'), value: 'globalCss', component: GlobalCss },
    { label: t('reading.setting.style.bookCss'), value: 'bookCss', component: BookCss },
  ]
})

onMounted(() => {
  //
})
</script>

<style lang="scss">
.custom-settings {
  height: calc(100vh - 40px);

  nav {
    height: 40px;
    padding: 8px 1rem 0 1rem;
    border-bottom: solid 1px var(--q-accent);
  }
}
</style>
