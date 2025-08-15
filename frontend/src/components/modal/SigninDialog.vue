<template>
  <o-common-dialog class="signin-dialog"
                   icon="login"
                   :title="$t('signin')"
                   :show="dialog.type === 'signin'"
                   show-ok
                   show-cancel
                   :content-style="style"
                   @close="onHide"
                   @ok="onOk" header>
    <section class="content">
      API凭证已经失效，须重新登录
    </section>
  </o-common-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import OCommonDialog from 'core/components/dialog/OCommonDialog.vue';
import useDialog from 'core/hooks/useDialog';
import useAccount from 'src/hooks/useAccount';

const { dialog, onHide } = useDialog();
const { autoLogin } = useAccount();

const style = computed(() => {
  return {
    minWidth: '400px',
    maxWidth: '400px',
    padding: '0px'
  };
});

const onOk = async () => {
  await autoLogin()
  onHide()
}
</script>

<style lang="scss">
.signin-dialog {
  .dialog-content {
    padding: 24px 16px;

    .content {
      font-size: 1.1rem;
    }
  }
}
</style>
