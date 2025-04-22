<template>
  <setting-card :title="$t('about')" class="about-tab">
    <o-common-card small>
      <section class="col-12">
        <q-list no-border link>
          <o-view-item label="名称" :value="appInfo.package.productName" />
          <o-view-item label="版本" :value="appInfo.package.version" />
          <o-view-item label="构建时间" :value="appInfo.build.time" />

          <q-separator class="bg-accent q-my-md" />

          <o-view-item label="首页" :value="APP_HOME_URL" :link="APP_HOME_URL" />
          <o-view-item label="文档地址" :value="APP_DOC_URL" :link="APP_DOC_URL" />
          <o-view-item label="Github" :value="APP_GITHUB_URL" :link="APP_GITHUB_URL" />
        </q-list>
      </section>
    </o-common-card>
  </setting-card>
</template>

<script setup lang="ts">
import { APP_HOME_URL, APP_DOC_URL, APP_GITHUB_URL } from 'src/app/app';
import SettingCard from './setting-card.vue';
import OViewItem from 'core/components/list/OViewItem.vue';

const appInfo = __APP_INFO__;
</script>

<style lang="scss">
.about-tab {
}
</style>
