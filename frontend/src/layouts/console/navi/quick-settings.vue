<template>
  <q-btn class="quick-settings no-drag-region"
         :class="type" flat>
    <img :src="account.avatar || $public('/logo.png')" alt="Logo" />
    <q-menu class="quick-settings-menu pi-menu show-side-icon"
            transition-show="jump-down"
            anchor="top left"
            self="top left"
            :offset="offset">
      <header>
        <q-item>
          <q-item-section avatar>
            <q-avatar size="48px">
              <img :src="account.avatar || $public('/logo.png')" alt="Logo" />
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

          <o-hover-menu menu-class="pi-menu"
                        anchor="top right" self="top left"
                        :offset="[12, 8]"
                        v-if="action.value === 'workspace'">
            <template #trigger>
              <o-common-item v-bind="action"
                             :closable="false" />
            </template>

            <o-common-item icon="o_workspaces"
                           label="管理空间"
                           clickable closable
                           right-side
                           @click="onAction({value: 'workspace'})" />
            <q-separator class="bg-dark" />

            <template v-for="(item, index) in workspaces" :key="index">
              <o-common-item :icon="item.icon || '🍃'"
                             :label="item.name"
                             :class="{ 'active': item.id === workspace.id }"
                             clickable closable
                             right-side
                             @click="onSwitchWorkspace(item)">
                <template #side>
                  <q-icon name="done" v-if="item.id === workspace.id" />
                </template>
              </o-common-item>
            </template>
          </o-hover-menu>
          <o-common-item v-bind="action"
                         @click="onAction(action)"
                         :closable="action.clickable" v-else>
          </o-common-item>
        </template>

        <q-separator class="bg-dark" />
        <footer class="row col-12 items-center">
          <div class="col">
            <o-common-item icon="logout" label="退出登录" clickable
                           @click="onAction({value: 'logout'})" />
          </div>
          <div class="col-auto">
            <div class="text-tips">
              <q-btn :icon="darkMode ? 'light_mode' : 'dark_mode'"
                     outline
                     @click="toggleTheme" />
              <locale-hover-btn anchor="center right"
                                self="center left"
                                :offset="[12, 0]"
                                outline enable-hover />
            </div>
          </div>
        </footer>
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
import OHoverMenu from 'core/components/menu/OHoverMenu.vue'

const props = defineProps({
  type: {
    type: String,
    default: ''
  },
});

const { account, workspace, workspaces, logout, switchWorkspace } = useAccount();
const { openDialog } = useDialog();
const { darkMode, toggleTheme } = useSetting();
const offset = computed(() => {
  return props.type === 'tab' ? [4, -2] : [-5, -5];
})

const actions = computed(() => {
  return [
    {
      label: "个人资料",
      value: "profile",
      icon: "o_account_circle",
      clickable: true,
      separator: true,
    },
    {
      label: "设置",
      value: "general",
      icon: "o_settings",
      sideLabel: "⌘G",
      clickable: true,
    },
    {
      label: "AI配置",
      value: "ai",
      icon: "mdi-creation-outline",
      clickable: true,
    },
    {
      label: "空间",
      value: "workspace",
      icon: "o_workspaces",
      sideIcon: 'chevron_right',
      separator: true,
    },
    {
      label: "系统日志",
      value: "log",
      icon: "o_view_headline",
      clickable: true,
      separator: true,
    },
    {
      label: "帮助",
      value: "help",
      icon: "o_support",
      sideIcon: "open_in_new",
      clickable: true,
    },
    {
      label: "关于",
      value: "about",
      icon: "o_info",
      clickable: true,
    },
  ];
});

const onAction = (action: Indexable) => {
  switch (action.value) {
    case 'about':
    case 'ai':
    case 'general':
    case 'log':
    case 'profile':
    case 'usage':
    case 'workspace':
      openDialog({type: 'settings', tab: action.value});
      break;
    case 'help':
      break;
    case 'logout':
      logout()
      break;
  }
}

const onSwitchWorkspace = (item: Indexable) => {
  switchWorkspace(item);
}
</script>

<style lang="scss">
.quick-settings {
  line-height: 0;

  &.group {
    width: 100%;
    text-align: center;
    padding: 5px 0;
    min-height: 30px;
    border-radius: 0;
    img {
      width: 38px;
      height: 38px;
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

    footer {
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
}
</style>
