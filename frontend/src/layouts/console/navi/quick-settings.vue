<template>
  <q-btn class="quick-settings no-drag-region"
         :class="type" flat>
    <o-icon :name="workspace.icon" v-if="workspace.icon" />
    <o-icon name="🍃" v-else />

    <template v-if="type === 'tab'">
      <div class="label q-ml-sm">{{workspace.name}}</div>
      <q-icon name="keyboard_arrow_down" class="text-tips q-ml-sm dropdown" size="1.2rem" />
    </template>

    <q-menu class="quick-settings-menu pi-menu show-side-icon"
            transition-show="jump-down"
            anchor="top left"
            self="top left"
            :offset="offset"
            @before-show="onBeforeShow">
      <header>
        <q-item>
          <q-item-section avatar>
            <q-avatar size="48px">
              <img :src="account.avatar || $public('/logo.png')" alt="Logo" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label style="font-size: 1.2rem;">
              {{ account.name }}
            </q-item-label>
            <q-item-label caption>
              {{ workspace.name }}
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
                           :label="$t('workspace.admin')"
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
            <o-common-item icon="logout" :label="$t('signout')" clickable
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
import { computed } from 'vue'
import useCommon from 'core/hooks/useCommon'
import useDialog from 'core/hooks/useDialog'
import useSetting from 'core/hooks/useSetting'
import useAccount from 'src/hooks/useAccount'
import LocaleHoverBtn from 'core/components/button/LocaleHoverBtn.vue'
import OHoverMenu from 'core/components/menu/OHoverMenu.vue'
import { openURL } from 'quasar'
import { APP_DOC_URL } from 'src/app/app'
import useShortcut from 'core/hooks/useShortcut'

const props = defineProps({
  type: {
    type: String,
    default: ''
  },
})

const {
  account,
  workspace,
  workspaces,
  logout,
  initWorkspace,
  switchWorkspace
} = useAccount()
const { t } = useCommon()
const { openDialog } = useDialog()
const { darkMode, toggleTheme } = useSetting()
const { nativeShortcut } = useShortcut()
const offset = computed(() => {
  return props.type === 'tab' ? [-2, -2] : [-2, -2]
})

const actions = computed(() => {
  return [
    {
      label: t('workspace._'),
      value: 'workspace',
      icon: 'o_workspaces',
      sideIcon: 'chevron_right',
      separator: true,
    },
    {
      label: t('profile'),
      value: 'profile',
      icon: 'o_account_circle',
      clickable: true,
      separator: true,
    },
    {
      label: t('settings'),
      value: 'general',
      icon: 'o_settings',
      sideLabel: nativeShortcut('mod G', ' '),
      clickable: true,
    },
    {
      label: t('ai.settings'),
      value: 'ai',
      icon: 'mdi-creation-outline',
      clickable: true,
    },
    {
      label: t('systems.log'),
      value: 'log',
      icon: 'o_view_headline',
      clickable: true,
      separator: true,
    },
    {
      label: t('help'),
      value: 'help',
      icon: 'o_support',
      sideIcon: 'open_in_new',
      clickable: true,
    },
    {
      label: t('about'),
      value: 'about',
      icon: 'o_info',
      clickable: true,
    },
  ]
})

const onAction = (action: Indexable) => {
  switch (action.value) {
    case 'about':
    case 'ai':
    case 'general':
    case 'log':
    case 'profile':
    case 'usage':
    case 'workspace':
      openDialog({type: 'settings', tab: action.value})
      break
    case 'help':
      openURL(APP_DOC_URL)
      break
    case 'logout':
      logout()
      break
  }
}

const onBeforeShow = () => {
  initWorkspace()
}

const onSwitchWorkspace = (item: Indexable) => {
  switchWorkspace(item)
}
</script>

<style lang="scss">
.tab-navi .top-header .q-btn.quick-settings {
  width: unset!important;


  .q-icon {
    font-size: 1.6rem !important;

    &.dropdown {
      font-size: 1.2rem !important;
    }
  }
}

.quick-settings {
  line-height: 0;
  .q-btn__content {
    flex-wrap: nowrap;
    //white-space: nowrap;
    //overflow: hidden;

    .label {
      display: inline-block;
      width: 80%;
      height: 30px;
      line-height: 30px;
      white-space: nowrap;        /* 不换行 */
      overflow: hidden;           /* 超出隐藏 */
      text-overflow: ellipsis;    /* 使用省略号 */
    }
  }

  .q-icon.dropdown {
    visibility: hidden;
  }

  &:hover {
    .q-icon.dropdown {
      visibility: visible;
    }
  }

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
    padding: 0 8px !important;
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
