<template>
  <q-btn class="quick-settings no-drag-region"
         :class="type" flat>
    <img :src="$public('/logo.png')" alt="Logo" />
    <q-menu class="quick-settings-menu pi-menu shadow-5"
            transition-show="jump-down"
            anchor="top left"
            self="top left"
            :offset="offset">
      <header>
        <q-item>
          <q-item-section avatar>
            <q-avatar size="48px">
              <img :src="$public('/logo.png')" alt="Logo" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-bold">
              {{ account.name }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </header>

      <q-list :style="{minWidth: '300px'}">
        <template v-for="(action, index) in actions" :key="`action-${index}`">
          <q-separator class="bg-dark" v-if="action.separator" />
          <o-common-item v-bind="action"
                         @click="onAction(action, '')"
                         closable>
            <template #side>
            </template>
          </o-common-item>
        </template>

        <q-separator class="bg-dark" />
        <div class="row col-12 items-center">
          <div class="col">
            <o-common-item icon="logout" label="退出登录" clickable disabled />
          </div>
          <div class="col-auto">
            <div class="text-tips">
              <locale-hover-btn anchor="center right"
                                self="center left"
                                :offset="[4, 0]"
                                outline enable-hover />
              <q-btn :icon="darkMode ? 'light_mode' : 'dark_mode'"
                     outline
                     @click="toggleTheme" />
            </div>
          </div>
        </div>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import useDialog from 'core/hooks/useDialog';
import useSetting from 'core/hooks/useSetting';
import useAccount from 'src/hooks/useAccount';
import LocaleHoverBtn from 'core/components/button/LocaleHoverBtn.vue';

const props = defineProps({
  type: {
    type: String,
    default: ''
  },
});

const { account } = useAccount();
const { openDialog } = useDialog();
const { darkMode, toggleTheme } = useSetting();
const offset = computed(() => {
  return props.type === 'tab' ? [4, -2] : [-8, -8];
})

const actions = computed(() => {
  return [
    {
      label: "账户管理",
      value: "profile",
      icon: "account_circle",
      clickable: true,
      separator: true,
    },
    {
      label: "设置",
      value: "general",
      icon: "settings",
      sideLabel: "⌘G",
      clickable: true,
    },
    {
      label: "AI配置",
      value: "ai",
      icon: "mdi-creation",
      clickable: true,
    },
    {
      label: "使用统计",
      value: "usage",
      icon: "data_usage",
      sideLabel: "⌘⇧",
      clickable: true,
      separator: true,
    },
    {
      label: "系统日志",
      value: "log",
      icon: "view_headline",
      sideLabel: "⌘⇧",
      clickable: true,
      separator: true,
    },
    {
      label: "帮助",
      value: "help",
      icon: "support",
      sideIcon: "open_in_new",
      clickable: true,
    },
  ];
});

function onAction (action: Indexable, value: any) {
  switch (action.value) {
    case 'profile':
    case 'general':
    case 'ai':
    case 'usage':
    case 'log':
      openDialog({type: 'settings', tab: action.value});
      break;
    case 'logout':
      break;
  }
}
</script>

<style lang="scss">
.quick-settings {
  line-height: 0;

  &.group {
    width: 100%;
    text-align: center;
    padding: 10px 0;
    min-height: 30px;
    img {
      width: 48px;
      height: 48px;
    }
  }

  &.tab {
    padding: 0;
    img {
      width: 28px;
      height: 28px;
    }
  }
}

.quick-settings-menu {
  min-width: 240px !important;
  border-radius: 8px;
  header {
    padding: 10px 10px 0 10px;

    .q-item {
      padding: 0;

      .q-item__section--main {
        padding-left: 0;
      }
    }
  }

  .q-list {
    padding-top: 0;

    .q-item {
      padding: 8px 6px;
      .side-label {
        padding-right: 0!important;
      }
    }

    .q-btn {
      min-width: unset;
      min-height: unset;
      width: 28px;
      height: 28px;
      padding: 0;
      margin-left: 6px;
      border-radius: 6px;
      opacity: 0.8;

      .q-icon {
        font-size: 1rem;
      }
    }
  }
}
</style>
