<template>
  <q-list class="background-colors">
    <section class="images-container pi-view-grid">
      <template v-for="(item, index) in list" :key="index">
        <div @click="onBackgroundColor(item)">
          <q-responsive :ratio="16/9">
            <q-card class="cover-item none"
                    :style="`background: ${item.background}`"
                    flat v-ripple>
              <q-icon name="block" size="3rem" class="text-tips" v-if="item.value === 'none'" />
              <q-icon name="check" size="1.6rem" class="selected"
                      v-if="item.background === backgroundColor" />
            </q-card>
          </q-responsive>

          <div class="row col-12 justify-between items-center">
            <div class="col text-bold ellipsis">
              {{item.label}}
            </div>
          </div>
        </div>
      </template>
    </section>
  </q-list>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import useReaderSetting from 'src/hooks/useReaderSetting'
import useCommon from 'core/hooks/useCommon'

const emit = defineEmits(['close'])

const { t } = useCommon()
const { settings, setSettingItem } = useReaderSetting()

const list = computed(() => {
  return [
    {
      label: 'None',
      value: 'none',
      background: '',
    },
    {
      label: t('appearances.colors.blue'),
      value: 'blue',
      background: 'linear-gradient(to bottom, #B8D6FF 10%, transparent 100%)',
    },
    {
      label: t('appearances.colors.yellow'),
      value: 'yellow',
      background: 'linear-gradient(to bottom, #F2DFB3 10%, transparent 100%)',
    },
    {
      label: t('appearances.colors.green'),
      value: 'green',
      background: 'linear-gradient(to bottom, #97CDA1 10%, transparent 100%)',
    },
  ]
})

const backgroundColor = computed(() => settings.value.backgroundColor)

const onBackgroundColor = async (item: Indexable) => {
  setSettingItem('backgroundColor', item.background)
}

onBeforeMount(() => {
  //
})
</script>

<style lang="scss">
.background-colors {
  .cover-item {}
}
</style>
