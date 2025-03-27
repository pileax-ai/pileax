<template>
  <o-hover-menu-btn class="console-hover-hover-btn"
                    icon="person"
                    anchor="bottom right"
                    self="top right"
                    menu-class="o-menu"
                    min-width="240px"
                    :label="account?.name"
                    :round="round"
                    :offset="offset" flat>
    <template v-for="(item, index) in actions" :key="index">
      <q-separator class="bg-accent" v-if="item.separator" />
      <o-common-item v-bind="item"
                     @click="onAction(item)"
                     clickable right-side closable round>
        <template #side>
          <o-chip v-bind="getArrayItem(UserTypes, account?.type)"
                  v-if="item.value==='role'"
                  style="font-size: 10px;" />
        </template>
      </o-common-item>
    </template>

  </o-hover-menu-btn>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useQuasar } from 'quasar';

import useCommon from 'core/hooks/useCommon';
import useDialog from 'core/hooks/useDialog';
import useRouter from 'core/hooks/useRouter';
import useAccount from 'src/hooks/useAccount';
import {getArrayItem, UserTypes} from 'src/app/metadata';
import OHoverMenuBtn from 'core/components/menu/OHoverMenuBtn.vue';

const $q = useQuasar();
const { t } = useCommon();
const { router } = useRouter();
const { account, logout } = useAccount();
const { openSettingsDialog } = useDialog();

const props = defineProps({
  round: {
    type: Boolean,
    default: false
  },
  showLabel: {
    type: Boolean,
    default: false
  },
  offset: {
    type: Array,
    default: function () {
      return [0, 8]
    }
  },
});

const actions = computed(() => {
  return [
    { label: '用户资料', value: 'role', icon: 'badge' },
    { label: t('settings'), value: 'settings', icon: 'settings', separator: true },
    { label: t(fullScreenTooltip.value), value: 'fullScreen', icon: fullScreenIcon.value },
    { label: '退出登录', value: 'signout', icon: 'logout', separator: true },
  ];
})

const fullScreenIcon = computed(() => {
  return $q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'
})

const fullScreenTooltip = computed(() => {
  return $q.fullscreen.isActive ? 'fullscreen.exit' : 'fullscreen'
})

function onAction (action) {
  switch (action.value) {
    case 'profile':
      router.push('/profile');
      break;
    case 'settings':
      openSettingsDialog();
      break;
    case 'fullScreen':
      $q.fullscreen.toggle();
      break;
    case 'signout':
      logout();
      break;
  }
}
</script>

<style lang="scss">
.console-hover-hover-btn {
  .q-btn {
    .q-icon {
      margin-right: 4px;
    }
  }
}
</style>
