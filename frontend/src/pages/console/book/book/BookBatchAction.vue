<template>
  <section class="row justify-center items-center book-batch-action"
           :class="{ 'show': selectable }">
    <div class="actions">
      <q-btn icon="subject" label="Group" flat stack v-if="false">
        <o-tooltip position="top" transition>{{ $t('book.addToCollection') }}</o-tooltip>
      </q-btn>
      <q-btn icon="o_dataset" :label="$t('book.groups.group')" flat stack
             @click="onGroupBatch"
             :disable="!ids.length">
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
})
const emit = defineEmits(['cancel', 'grouped', 'removed'])

const { openDialog } = useDialog()
const { removeBookBatch } = useBookDetails()

function onGroupBatch() {
  openDialog({
    type: 'book-group-batch',
    data: props.ids,
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
