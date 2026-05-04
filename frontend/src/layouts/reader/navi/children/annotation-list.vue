<template>
  <drawer-navi class="annotation-navi-list"
               header-class="row col-12 justify-between items-center q-px-md text-tips"
               header>
    <template #header>
      <div>
        <o-menu-btn :label="type?.label"
                    class="bg-dark"
                    anchor="bottom left"
                    self="top left"
                    min-width="240px"
                    flat dense dropdown>
          <template #icon>
            <o-icon :name="type?.icon" width="20px" />
          </template>
          <template #menu>
            <template v-for="(item, index) in BookAnnotationTypes" :key="index">
              <o-common-item v-bind="item"
                             :active="item.value === currentType"
                             @click="onSelectType(item)"
                             clickable closable dense>
              </o-common-item>
            </template>
          </template>
        </o-menu-btn>
      </div>
      <div>
        <q-btn icon="more_horiz" size="0.8rem" flat dense>
          <q-menu class="pi-menu" :offset="[0, 4]">
            <q-list :style="{minWidth: '200px'}">
              <template v-for="(action, index) in actions" :key="`action-${index}`">
                <q-separator class="bg-accent" v-if="action.separator" />
                <o-common-item v-bind="action"
                               class="text-tips"
                               :class="{ 'active': action.selected }"
                               @click="onAction(action)"
                               clickable
                               closable
                               right-side>
                  <template #side>
                    <q-icon :name="orderDesc ? 'south' : 'north'"
                            v-if="action.sortable" />
                  </template>
                </o-common-item>
              </template>
              <slot></slot>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </template>
    <template #content>
      <q-list class="list" :style="`width: ${width}px`" v-if="annotations.length">
        <template v-for="(item, index) in annotations" :key="index">
          <o-book-annotation-item :item="item" />
        </template>
      </q-list>
      <section class="text-readable text-center" v-else>
        <o-no-data :message="$t('query.noRecords')" />
      </section>
    </template>
  </drawer-navi>
</template>

<script setup lang="ts">
import DrawerNavi from 'core/page/DrawerNavi.vue'
import OBookAnnotationItem from 'src/components/book/OBookAnnotationItem.vue'
import {computed, onBeforeMount, ref, watch} from 'vue'
import useBookNote from 'src/hooks/useBookNote'
import OMenuBtn from 'core/components/menu/OMenuBtn.vue'
import useMetadata from 'src/hooks/useMetadata'
import useCommon from 'core/hooks/useCommon'

const { t } = useCommon()
const { BookAnnotationTypes } = useMetadata()
const { annotations, annotationTimer, initAnnotationData } = useBookNote()

const props = defineProps({
  width: {
    type: Number,
    default: 300
  },
})
const currentType = ref('')
const orderField = ref('recentAdd')
const orderDesc = ref(false)
const sort = ref<Indexable>({ update_time: 'asc' })

const type = computed(() => {
  return BookAnnotationTypes.value.find(i => i.value === currentType.value)
})

const actions = computed(() => {
  return [
    {
      label: t('sortBy.recentAdd'),
      value: 'recentAdd',
      icon: 'schedule',
      selected: orderField.value === 'recentAdd',
      sortable: true,
      separator: false,
    },
    {
      label: t('sortBy.pageNumber'),
      value: 'page',
      icon: 'format_list_numbered_rtl',
      selected: orderField.value === 'page',
      sortable: true,
    },
  ]
})

function onSelectType(item: Indexable) {
  currentType.value = item.value
  refreshAnnotation()
}

function onAction (action :any) {
  const value = action.value
  switch (value) {
    case 'recentAdd':
      if (orderField.value === value) {
        orderDesc.value = !orderDesc.value
      } else {
        orderDesc.value = false
      }
      orderField.value = value
      sort.value = { update_time: orderDesc.value ? 'desc' : 'asc' }
      refreshAnnotation()
      break
    case 'page':
      if (orderField.value === value) {
        orderDesc.value = !orderDesc.value
      } else {
        orderDesc.value = false
      }
      orderField.value = value
      sort.value = { page: orderDesc.value ? 'desc' : 'asc' }
      refreshAnnotation()
      break
    default:
      break
  }
}

function refreshAnnotation() {
  initAnnotationData(currentType.value, sort.value)
}

watch(() => annotationTimer.value, (newValue) => {
  refreshAnnotation()
})

onBeforeMount(() => {
  refreshAnnotation()
})
</script>

<style lang="scss">
.annotation-navi-list {
  .o-scroll-wrapper.with-header {
    top: 50px;
  }

  .q-item {
    border-radius: 4px;
    margin-top: 2px;

    &.active:before {
      border-radius: 4px;
    }
  }
}
</style>
