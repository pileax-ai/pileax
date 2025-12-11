<template>
  <q-menu class="o-general-icon-menu shadow-5"
          ref="menuRef"
          :anchor="anchor"
          :self="self"
          :offset="offset">
    <q-tabs v-model="currentTab"
            align="left"
            inline-label>
      <template v-for="(item, index) in tabs" :key="index">
        <q-tab :name="item.value" :label="item.label" />
      </template>
    </q-tabs>

    <q-tab-panels v-model="currentTab"
                  class="bg-transparent"
                  keep-alive>
      <q-tab-panel name="emoji">
        <o-emoji-select :items="emojiGroups"
                        @select="onSelectEmoji"
                        enable-search />
      </q-tab-panel>
      <q-tab-panel name="icon">
        <o-icon-select @select="onSelectIcon" />
      </q-tab-panel>
    </q-tab-panels>
  </q-menu>
</template>

<script setup lang="ts">
import type { PropType} from 'vue'
import { computed, ref } from 'vue'
import { OEmojiSelect } from '@yiitap/vue'
import { emojiGroups } from '@yiitap/util-emoji'
import OIconSelect from 'components/icon/OIconSelect.vue'
import OSplitPage from 'core/page/template/OSplitPage.vue'
import { QMenu } from 'quasar'

const props = defineProps({
  anchor: {
    type: String as PropType<PositionType>,
    default: 'bottom middle'
  },
  self: {
    type: String as PropType<PositionType>,
    default: 'top middle'
  },
  offset: {
    type: Array as PropType<number[]>,
    default: () => {
      return [0, 0]
    }
  },
})
const emit = defineEmits(['emoji', 'icon'])
const menuRef = ref<InstanceType<typeof QMenu>>()
const currentTab = ref('emoji')

const tabs = computed(() => {
  return [
    {
      label: 'Emoji',
      value: 'emoji'
    },
    {
      label: 'Icon',
      value: 'icon'
    }
  ]
})

function onSelectEmoji(option: Indexable) {
  emit('emoji', option)

  menuRef.value?.hide()
}

function onSelectIcon(option: Indexable) {
  emit('icon', option)

  menuRef.value?.hide()
}
</script>

<style lang="scss">
.o-general-icon-menu {
  padding: 0;
  width: 650px;
  height: 600px;

  .q-tabs {
  }

  .q-tab-panel {
    padding: 10px;
    height: 552px;

    .o-emoji-select {
      width: 100%;

      .o-scroll {
        max-height: 450px!important;
      }

      .item {
        width: 36px;
        height: 36px;
        font-size: 30px;
      }
    }
  }
}
</style>
