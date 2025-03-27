<template>
  <q-toolbar class="justify-center base-toolbar">
    <section class="row col-12 justify-start desktop top-nav">
      <div class="row col-12 justify-start full-height">
        <!-- Logo -->
        <div class="col-auto">
          <div class="row items-center logo-wrapper cursor-pointer" @click="$router.push('/')">
            <div class="col-auto row items-center full-height">
              <img src="logo.png"/>

              <span class="q-ml-md text-info">
                {{$t("app.name")}}
              </span>
            </div>

          </div>
        </div>

        <!-- Top Navi -->
        <div class="col row items-center o-toolbar">
          <div class="top-menus">
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
          </div>
          <q-toolbar-title />
        </div>

        <!-- Extra -->
        <div class="col-md-7">
          <div class="row col-12 justify-end items-center o-toolbar-extra">
            <q-btn :label="$t('console')" class="bg-primary text-white" @click="onConsole" rounded flat />
            <q-btn :label="$t('signin')" class="bg-primary text-white" to="/signin" rounded flat />
          </div>
        </div>
      </div>
    </section>
  </q-toolbar>
</template>

<script setup lang="ts">
import { router } from 'src/router';

import { onAction } from 'core/hooks/useRouter';
import { menuLabel } from 'core/hooks/useMenu';
import useAccount from 'src/hooks/useAccount';
import { topMenus } from 'src/app/top-menu';

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
  position: fixed;
  z-index: 101;
  background: rgba(#fff, 0.7) !important;
  backdrop-filter: blur(20px);
  transform: translateZ(0px);

  .top-nav {
    height: $hheight;
    max-width: 1200px;

    .top-nav-container {
      max-width: 1080px;
    }

    .logo-wrapper {
      width: 200px;
      height: $hheight;
      font-size: 1.2rem;

      img {
        height: 40px;
      }
    }

    .logo {
      height: 36px;
      width:  200px;
      margin: 12px 0 0 0px;
    }
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

    .top-menus {
      margin-right: 16px;
    }

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
