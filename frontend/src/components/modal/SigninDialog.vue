<template>
  <o-common-dialog class="signin-dialog dialog-theme"
                   :show="dialog.type === 'signin'"
                   :content-style="style"
                   @close="onHide"
                   @ok="onOk"
                   show-ok
                   show-cancel>
    <header class="row justify-center items-center" v-touch-pan.prevent.mouse="onPan">
      <q-icon name="login" />
    </header>
    <section class="content">
      <div class="title">
        {{ $t('signin') }}
      </div>
      <div class="message">
        {{ $t('auth.tokenExpired') }}
      </div>
    </section>
  </o-common-dialog>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'

import OCommonDialog from 'core/components/dialog/OCommonDialog.vue'
import useDialog from 'core/hooks/useDialog'
import useAccount from 'src/hooks/useAccount'

const { dialog, onHide } = useDialog()
const { logout } = useAccount()
const pos = reactive({ x: 0, y: 0 })

const style = computed(() => {
  return {
    minWidth: '540px',
    maxWidth: '540px',
    padding: '0px',
    transform: `translate(${pos.x}px, ${pos.y}px)`
  }
})

const onPan = (evt: any) => {
  pos.x += evt.delta.x
  pos.y += evt.delta.y
}

const onOk = () => {
  logout()
  onHide()
}
</script>

<style lang="scss">
@import "./dialog-theme";
.signin-dialog {
}
</style>
