<template>
  <section class="row justify-center items-center book-batch-action"
           :class="{ 'show': selectable }">
    <div class="actions">
      <q-btn icon="mdi-folder-minus-outline" label="Ungroup" flat stack
             @click="onUngroupBatch"
             :disable="!ids.length"
             v-if="groupId">
        <o-tooltip position="top" transition>{{ $t('book.groups.ungroupTip') }}</o-tooltip>
      </q-btn>
      <q-btn icon="mdi-folder-edit-outline"
             :label="$t('book.groups.group')"
             flat stack
             @click="onGroupBatch"
             :disable="!ids.length"
             v-if="groupId">
        <o-tooltip position="top" transition>{{ $t('book.groups.change') }}</o-tooltip>
      </q-btn>
      <q-btn icon="mdi-folder-plus-outline"
             :label="$t('book.groups.group')"
             flat stack
             @click="onGroupBatch"
             :disable="!ids.length"
             v-else>
        <o-tooltip position="top" transition>{{ $t('book.addToGroup') }}</o-tooltip>
      </q-btn>
      <q-btn icon="o_delete" :label="$t('remove')"
             class="text-orange"
             flat stack
             @click="onRemoveBatch"
             :disable="!ids.length">
        <o-tooltip position="top" transition>{{ $t('book.remove') }}</o-tooltip>
      </q-btn>
      <q-btn icon="o_cancel" :label="$t('cancel')" flat stack @click="emit('cancel')" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import useBookDetails from 'src/hooks/useBookDetails'
import useDialog from 'core/hooks/useDialog'
import { workspaceBookService } from 'src/api/service/remote'

const props = defineProps({
  ids: {
    type: Array as PropType<string[]>,
    default: function () {
      return []
    }
  },
  selectable: {
    type: Boolean,
    default: false
  },
  groupId: {
    type: String,
    default: ''
  },
})
const emit = defineEmits(['cancel', 'grouped', 'removed', 'ungrouped'])

const { openDialog } = useDialog()
const { removeBookBatch } = useBookDetails()


function onUngroupBatch() {
  const body = {
    ids: props.ids
  }
  workspaceBookService.updateGroupBatch(body).then(() => {
    emit('ungrouped')
  })
}

function onGroupBatch() {
  openDialog({
    type: 'book-group-batch',
    data: {
      ids: props.ids,
      groupId: props.groupId
    },
    onOk: () => {
      emit('grouped')
    }
  })
}

function onRemoveBatch() {
  removeBookBatch(props.ids).then(() => {
    emit('removed')
  })
}
</script>

<style lang="scss">
.book-batch-action {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100px;

  visibility: hidden;
  opacity: 0;
  transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out, visibility 0.2s;
  transform: translateY(100%);

  &.show {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
  }

  .actions {
    padding: 1rem;
    color: white;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 12px;
  }
}
</style>
