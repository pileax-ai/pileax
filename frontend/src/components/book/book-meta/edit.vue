<template>
  <section class="book-meta-edit">
    <nav class="col-12 bg-accent navi q-px-md">
      <q-tabs v-model="currentTab"
              align="center"
              active-color="info"
              class="text-readable"
              inline-label narrow-indicator dense>
        <template v-for="(item, index) of tabs" :key="index">
          <template v-if="item.show">
            <q-tab class="o-navi-tab"
                   :name="item.value"
                   :icon="item.icon"
                   :label="item.label" />
          </template>
        </template>
      </q-tabs>
    </nav>

    <section class="panels-container">
      <q-tab-panels v-model="currentTab" class="fit col-12" vertical keep-alive>
        <template v-for="(item, index) of tabs" :key="index">
          <template v-if="item.show">
            <q-tab-panel :name="item.value">
              <component :is="item.component" :data="data" />
            </q-tab-panel>
          </template>
        </template>
      </q-tab-panels>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, type PropType, ref } from 'vue'
import useDialog from 'core/hooks/useDialog'
import useCommon from 'core/hooks/useCommon'

import BookGeneralTab from './book-general-tab.vue'
import BookUserTab from './book-user-tab.vue'

const props = defineProps({
  data: {
    type: Object as PropType<Indexable>,
    default: () => {}
  }
})

const { dialog, onHide } = useDialog()
const { t } = useCommon()
const currentTab = ref('basic')

const tabs = computed(() => {
  return [
    {
      label: t('book.metadata.user'),
      value: 'user',
      icon: 'o_person',
      component: BookUserTab,
      show: true,
    },
    {
      label: t('book.metadata.general'),
      value: 'general',
      icon: 'mdi-tune-variant',
      component: BookGeneralTab,
      show: props.data.userId === props.data.bookUserId,
    },
  ]
})

const tab = computed(() => {
  return tabs.value.find(t => t.value === currentTab.value)
})

onMounted(() => {
  currentTab.value = (props.data.userId === props.data.bookUserId)
    ? 'general'
    : 'user'
})
</script>

<style lang="scss">
.book-meta-edit {
  nav {
    .q-tab {
      padding: 0 24px;
      margin: 0 2px;
      border-radius: 6px 6px 0 0;
      background: var(--q-dark);

      &:before {
        border-radius: 6px 6px 0 0;
      }

      &__label {
        font-size: 1.1rem;
      }

      .q-icon {
        font-size: 1.4rem;
      }
    }
  }

  .panels-container {
    max-width: 720px;
    margin: 0 auto;
  }
}
</style>
