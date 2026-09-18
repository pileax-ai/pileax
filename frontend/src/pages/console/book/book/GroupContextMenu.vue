<template>
  <o-context-menu :context-menu="contextMenu"
                  :list="actions"
                  @command="onAction">
  </o-context-menu>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import OContextMenu from 'core/components/menu/OContextMenu.vue'
import useCommon from 'core/hooks/useCommon'
import { router } from 'src/router'

const props = defineProps({
  contextMenu: {
    type: Boolean,
    default: false
  },
  group: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    required: true
  },
})
const emit = defineEmits(['edit'])

const { t } = useCommon()

const actions = computed(() => {
  return [
    {
      label: t('book.groups.open'),
      value: 'open',
      icon: 'arrow_forward',
    },
    {
      label: t('book.groups.edit'),
      value: 'edit',
      icon: 'o_edit',
    },
  ]
})

function onAction (action :any) {
  switch (action.value) {
    case 'open':
      onOpen()
      break
    case 'edit':
      emit('edit', props.data)
      break
    default:
      break
  }
}


function onOpen() {
  router.push({ name: 'book-group', params: { id: props.data.id } })
}
</script>
