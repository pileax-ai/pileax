<template>
  <q-toolbar class="base-toolbar drag-region">
    <div class="row items-center cursor-pointer app" @click="$router.push('/')">
      <q-avatar size="40px">
        <img :src="$public('/logo.svg')">
      </q-avatar>
      <span class="q-ml-sm">
        {{ $t('app.name') }}
      </span>
    </div>

    <q-toolbar-title class="no-drag-region">
      <q-tabs class="o-navi-tabs" align="left" shrink inline-label>
        <template v-for="(item, index) in topMenus" :key="`r-${index}`">
          <div v-if="!item.hidden">
            <q-route-tab :to="item.to" exact :label="menuLabel(item.label)" v-if="!item.action || item.action==='route'">
              <q-icon :name="item.naviIcon" :color="item.color" v-if="item.naviIcon"/>
            </q-route-tab>
            <q-tab :label="menuLabel(item.label)" @click="onAction(item)" v-else>
              <q-icon :name="item.naviIcon" :color="item.color" v-if="item.naviIcon"/>
            </q-tab>
          </div>
        </template>
      </q-tabs>
    </q-toolbar-title>

    <div class="row items-center o-toolbar-extra no-drag-region">
      <q-btn :label="$t('console')" class="bg-primary text-white" @click="onConsole" rounded flat v-if="isLogin" />
      <q-btn :label="$t('signin')" class="bg-primary text-white" to="/auth/signin" rounded flat v-else />
    </div>
    <o-tool-bar-overlay class="col-auto" />
  </q-toolbar>
</template>

<script setup lang="ts">
import { router } from 'src/router';

import { onAction } from 'core/hooks/useRouter';
import { menuLabel } from 'core/hooks/useMenu';
import useAccount from 'src/hooks/useAccount';
import { topMenus } from 'src/app/top-menu';
import OToolBarOverlay from 'core/components/electron/OToolBarOverlay.vue'

const { account, isLogin } = useAccount();

function onConsole() {
  console.log('console');
  router.push('/welcome');
}
</script>

<style lang="scss">
$hheight: 80px;
.base-toolbar {
  height: 100%;
  padding: 0 24px;
  z-index: 101;
  background: rgba(#fff, 0.7) !important;
  backdrop-filter: blur(20px);
  transform: translateZ(0px);

  .app {
    width: 200px;
  }


  .o-navi-tabs {
    height: 40px;
    .q-tab {
      //color: white;
      padding: 4px 1.2rem;
      margin: 0 4px;
      min-width: 80px;
      min-height: unset;
      border-radius: 4px;

      .q-tab__indicator {
        display: none;
      }

      .q-tab__label {
        font-size: 1.1rem;
        font-weight: 400
      }

      .q-icon {
        margin-left: 4px;
        font-size: 1.5rem;
      }

      .iconfont {
        font-size: 1.6rem;
      }
    }

    a.q-tab:hover {
      //color: #ffffff;
      //background: transparent;
    }

    .q-tab--active {
      //background: transparent;
      background: rgba(#000, 0.03);

      .q-tab__label {
        //color: white;
        font-weight: 600;
      }
    }
  }

  .o-toolbar-extra {
    height: 100%;

    .q-btn {
      height: 40px;
      min-width: 120px;
      margin: 0 6px;
      padding: 4px 16px;

      .q-icon {
        font-size: 1.4rem;
      }
    }

    .q-btn--round {
      width: 42px;
      min-width: unset;
      padding: 4px 10px;
      color: white;
      background: rgba(white, 0.1);
    }
  }
}
</style>
