<template>
  <o-common-dialog class="note-share-dialog dialog-theme"
                   :ok="$t('view._')"
                   :show="dialog.type === 'note-share'"
                   :content-style="style"
                   @close="onHide"
                   @ok="onView"
                   :show-cancel="noteShared"
                   :show-ok="noteShared">
    <header class="row justify-center items-center" v-touch-pan.prevent.mouse="onPan">
      <q-icon name="share" />
    </header>
    <section class="content">
      <div class="meta">
        <o-view-item icon="o_article" :label="$t('note._')" :value="note.title" align="right" clickable />
        <o-view-item icon="o_share" :label="$t('share')" align="right" right-side>
          <template #side>
            <q-toggle v-model="shareStatus" @update:modelValue="onToggleShare" />
          </template>
        </o-view-item>
        <o-view-item icon="o_timer" :label="$t('shareTime')"
                     :value="timeMulti(share.updateTime).timestamp()"
                     align="right"
                     clickable v-if="noteShared" />
      </div>

      <template v-if="noteShared">
        <q-banner rounded class="bg-dark text-readable" inline-actions>
          {{ sharedLink }}
          <template v-slot:avatar>
            <q-icon name="o_link" size="1.4rem" />
          </template>
          <template v-slot:action>
            <o-copy-btn :value="sharedLink" flat />
          </template>
        </q-banner>

        <div class="row col-12 items-center q-mt-md q-px-md">
          <div class="col-auto">
            <o-qrcode :text="sharedLink" :size="120" />
          </div>
          <div class="col text-center text-bold">
            {{ $t('shareQrcode') }}
          </div>
        </div>

      </template>
      <template v-else>
        <o-no-data image />
      </template>
    </section>

    <template #left-actions>
      <div class="row items-center text-tips" v-if="false">
        <q-icon name="visibility" />
        <span class="q-ml-xs">{{ share.viewCount }}</span>
      </div>
    </template>
  </o-common-dialog>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, reactive, ref } from 'vue'

import OCommonDialog from 'core/components/dialog/OCommonDialog.vue'
import OQrcode from 'core/components/misc/OQrcode.vue'
import useDialog from 'core/hooks/useDialog'
import useCommon from 'core/hooks/useCommon'
import { noteShareService } from 'src/api/service/remote'
import { timeMulti } from 'core/utils/dayjs'

const { dialog, onHide, onOk } = useDialog()
const { t } = useCommon()
const pos = reactive({ x: 0, y: 0 })
const share = ref<Indexable>({})
const shareStatus = ref(false)

const note = computed(() => {
  return dialog.value.data
})

const noteShared = computed(() => {
  return !!share.value.id
})

const sharedLink = computed(() => {
  return `${window.location.origin}/s/${share.value.shareId}`
})

const style = computed(() => {
  return {
    minWidth: '640px',
    maxWidth: '640px',
    padding: '0px',
    transform: `translate(${pos.x}px, ${pos.y}px)`
  }
})

const onPan = (evt: any) => {
  pos.x += evt.delta.x
  pos.y += evt.delta.y
}

const onView = () => {
  window.open(sharedLink.value, '_blank')
}

const onToggleShare = async (value: boolean) => {
  console.log('value', value)
  try {
    if (value) {
      await enableShare()
    } else {
      await disableShare()
    }
  } catch (err) {
    console.warn(err)
    shareStatus.value = !value
  }
}

const enableShare = async () => {
  share.value = await noteShareService.save({
    noteId: note.value.id,
    shareType: 'public'
  })
}

const disableShare = async () => {
  await noteShareService.delete(share.value.id)
  share.value = {}
}

const onLoad = () => {
  noteShareService.getByNote(note.value.id).then(res => {
    share.value = res
    shareStatus.value = true
  })
}

onBeforeMount(onLoad)
</script>

<style lang="scss">
@import "./dialog-theme";
.note-share-dialog {
  .q-banner {
    &__avatar {
      align-self: center;
    }
  }
  .content {
    .meta {
      padding: 0 0 1rem 0;

      .o-view-item {
        min-height: 42px;
        padding: 0 1rem;
        .labels {
          margin-left: 1rem;
        }
      }
    }
  }
}
</style>
