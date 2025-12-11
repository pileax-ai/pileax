<template>
  <q-menu class="o-emoji-menu shadow-5"
          ref="menu"
          anchor="bottom middle"
          self="top middle"
          :offset="[0, 8]">
    <o-emoji-select :items="emojiGroups"
                    @select="onSelect"
                    enable-search />
  </q-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { OEmojiSelect } from '@yiitap/vue'
import { emojiGroups } from '@yiitap/util-emoji'

const props = defineProps({
  dense: {
    type: Boolean,
    default: false
  },
})
const emit = defineEmits(['select'])
const menu = ref(null)

function onSelect(option: Indexable) {
  emit('select', option)

  menu.value?.hide()
}
</script>

<style lang="scss">
.o-emoji-menu {
  padding: 10px;
}
</style>
