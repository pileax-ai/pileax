<template>
  <o-common-page class="page-welcome">
    <o-common-card class="row items-end app">
      <section class="">
        <div class="name">
          {{$t('app.name')}}
        </div>
        <div>
          {{$t('app.slogan')}}
        </div>
      </section>
    </o-common-card>

    <section class="relative-position col-12 navi-card">
      <section class="row col-12 q-col-gutter-lg">
        <section class="col-12">
          <o-common-card title="快速开始" accent header>
            <section class="row col-12 q-col-gutter-x-lg q-pa-md">
              <div class="col-3" v-for="(item, index) of favoriteMenus" :key="index">
                <o-common-item size="4rem"
                               :icon="item.icon"
                               :color="item.color"
                               :label="item.name"
                               @click="onAction({path: item.path})"
                               clickable>
                </o-common-item>
              </div>
            </section>
            ABC: {{serverInfo || 'N/A'}}
          </o-common-card>
        </section>

        <section class="col-12 stars" v-if="starMenus.length">
          <o-common-card title="收藏" class="bg-secondary" header>
            <template #right>
              <q-btn icon="delete_outline" round flat @click="clearStarMenus">
                <o-tooltip>清除</o-tooltip>
              </q-btn>
            </template>

            <section class="row col-12 justify-start q-col-gutter-lg q-pa-lg">
              <div class="col-2" v-for="(item, index) of starMenus"
                   :key="index">
                <o-common-item :icon="item.icon"
                               :color="item.color"
                               :label="item.name"
                               size="3rem"
                               class="bg-accent"
                               @click="onAction(item as Action)"
                               clickable right-side round>
                  <template #side>
                    <q-btn icon="close" size="10px" class="unstar" flat round
                           @click.stop="unstarMenu(item)">
                      <o-tooltip>{{$t('unstar')}}</o-tooltip>
                    </q-btn>
                  </template>
                </o-common-item>
              </div>
            </section>
          </o-common-card>
        </section>
      </section>
    </section>
  </o-common-page>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { onAction } from 'core/hooks/useRouter';
import useNavi from 'src/hooks/useNavi';
import { GET } from 'src/hooks/useRequest';
import { electronIpc } from 'src/api/ipc/electron';

import OCommonPage from 'core/page/template/OCommonPage.vue';
import { MenuItem } from 'core/types/menu';

const route = useRoute();
const { favoriteMenus, starMenus, clearStarMenus, unstarMenu } = useNavi();
const serverInfo = ref({});

function init() {
  console.log('env', process.env.VITE_APP_NAME, window.__TAURI_INTERNALS__);
  electronIpc.getServerInfo().then((res: any) => {
    serverInfo.value = res;
  }).catch((err: any) => {
    console.error('Electron IPC：', err);
  })

  GET({name: 'systemHealthCheck'}).then(res => {
    console.log('res', res)
  }).catch((err: Error) => {
    console.error('Request：', err);
  })
}

onMounted(() => {
  init();
});
</script>

<style lang="scss">
.page-welcome {
  .app {
    min-height: 80px;
    padding: 21px 21px;

    .name {
      font-size: 48px;
    }
  }

  .navi-card {
    padding: 21px;
  }

  .o-common-card {
    .title {
      font-size: 18px;
    }
  }

  .recent {
    .o-common-item {
      padding: 0 6px;
    }
  }

  .stars {
    .q-item {
      padding-right: 6px!important;
      min-width: 180px;

      .unstar {
        visibility: hidden;
      }

      &:hover {
        .unstar {
          visibility: visible;
        }
      }
    }
    .q-item:not(:first-child) {
      margin-left: 1rem;
    }
  }
}

.mobile {
  .page-welcome {
    .app {
      padding: 0 16px;
      .name {
        font-size: 32px;
      }
    }

    .navi-card {
      padding: 16px;
    }
  }
}
</style>
