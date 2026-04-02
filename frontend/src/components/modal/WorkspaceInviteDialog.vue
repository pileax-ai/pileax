<template>
  <o-common-dialog class="workspace-invite-dialog dialog-theme"
                   title="ABC"
                   :ok="$t('workspace.invites.accept')"
                   :show="dialog.type === 'workspace-invite'"
                   :content-style="style"
                   @close="onHide"
                   @ok="onOk"
                   show-cancel
                   show-ok>
    <header class="row justify-center items-center" v-touch-pan.prevent.mouse="onPan">
      <q-icon :name="dialog.icon || 'person_add'" />
    </header>
    <section class="content">
      <div class="title">
        {{ $t('workspace.invite') }}
      </div>
      <div class="message row items-center">
        <q-chip square>
          <q-avatar color="primary" text-color="white">
            <q-icon name="o_person" />
          </q-avatar>
          {{data.invitedByName}}
        </q-chip>

        <div class="q-px-sm">{{ $t('workspace.invites.inviteToJoin') }}</div>

        <q-chip square>
          <q-avatar color="cyan" text-color="white">
            <q-icon name="o_workspaces" />
          </q-avatar>
          {{data.workspaceName}}
        </q-chip>
      </div>
    </section>

    <template #left-actions>
      <q-checkbox v-model="noShowAgain"
                  :label="dialog.noShowAgain || $t('noShowAgain')"
                  style="margin-left: -8px;"
                  @update:modelValue="onNoShowAgain"
                  v-if="key" />
    </template>
  </o-common-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

import OCommonDialog from 'core/components/dialog/OCommonDialog.vue'
import useDialog from 'core/hooks/useDialog'
import useGuide from 'src/hooks/useGuide'
import { workspaceMemberService } from 'src/api/service/remote'
import { notifyDone } from 'core/utils/control'

const { dialog, onHide } = useDialog()
const { closeGuide } = useGuide()
const noShowAgain = ref(false)
const pos = reactive({ x: 0, y: 0 })

const style = computed(() => {
  return {
    minWidth: '540px',
    maxWidth: '540px',
    padding: '0px',
    transform: `translate(${pos.x}px, ${pos.y}px)`
  }
})

const data = computed(() => {
  return dialog.value.data
})

const key = computed(() => {
  return `invite-${data.value.id}`
})

const onOk = () => {
  workspaceMemberService.acceptInvite(data.value.id).then(res => {
    notifyDone()
    onHide()
  })
}

const onPan = (evt: any) => {
  pos.x += evt.delta.x
  pos.y += evt.delta.y
}

const onNoShowAgain = () => {
  if (typeof dialog.value.onNoShowAgain === 'function') {
    dialog.value.onNoShowAgain()
  } else {
    closeGuide(key.value)
  }
}
</script>

<style lang="scss">
@import "./dialog-theme";
.workspace-invite-dialog {
}
</style>
