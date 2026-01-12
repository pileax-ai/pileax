<template>
  <o-console-page class="page-about"
                  content-class="row col-12 justify-center"
                  expandable
                  extend-header enable-fullscreen>
    <template #header-extension>
      <span class="text-tips q-px-sm">
        {{$t('product.description')}}
      </span>
    </template>

    <o-common-card icon="subject"
                   title="应用信息"
                   class="col-12"
                   content-class="row col-12 q-pa-lg"
                   header>
      <div class="col-6">
        <o-view-item label="名称" :value="appInfo.package.name" />
        <o-view-item label="版本" :value="appInfo.package.version" />
        <o-view-item label="构建时间" :value="timeMulti(appInfo.build.time).timestamp()" />
      </div>
      <div class="col-6">
        <o-view-item label="首页" :value="APP_HOME_URL" :link="APP_HOME_URL" />
        <o-view-item label="文档地址" :value="APP_DOC_URL" :link="APP_DOC_URL" />
        <o-view-item label="Github" :value="APP_GITHUB_URL" :link="APP_GITHUB_URL" />
      </div>
    </o-common-card>

    <template #extension>
      <Dependencies />
    </template>
  </o-console-page>
</template>

<script setup lang="ts">
import { APP_HOME_URL, APP_DOC_URL, APP_GITHUB_URL } from 'src/app/app'

import Dependencies from './Dependencies.vue'
import OViewItem from 'core/components/list/OViewItem.vue'
import { timeMulti } from 'core/utils/dayjs'

const appInfo = __APP_INFO__
</script>

<style lang="scss">
.page-about {
  .o-query-section {
    .header-extension {
      display: none;
    }
  }

  .console-content {
    .q-card {
      background: var(--q-accent) !important;
    }
  }
}
</style>
