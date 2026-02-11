<template>
  <o-common-item class="o-update-item"
                 icon="o_arrow_circle_up"
                 clickable right-side
                 @click="onAction">
    <template #label>
      <div v-if="isDownloading" style="width: 100%">
        <q-linear-progress :value="progressPercent" size="8px" rounded />
      </div>
      <div class="row items-center" v-else>
        <div>{{ displayLabel }}</div>
        <q-badge color="red" rounded align="middle" class="dot q-ml-xs"
                 v-if="hasUpdate" />
      </div>
    </template>
    <template #side>
      <o-badge v-if="hasUpdate && downloaded">{{ $t('ready') }}</o-badge>
      <o-badge v-else color="grey">{{ packageInfo.version }}</o-badge>
    </template>
  </o-common-item>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { packageInfo } from 'core/app'
import useUpdater from 'core/hooks/useUpdater'
import useCommon from 'core/hooks/useCommon'
import useDialog from 'core/hooks/useDialog'
import { ipcService } from 'src/api/ipc'

import OUpdaterInfo from 'components/app/updater/OUpdaterInfo.vue'
import { notifyInfo } from 'core/utils/control'

const { t } = useCommon()
const { openDialog } = useDialog()
const { updater, setUpdater } = useUpdater()

const displayLabel = computed(() => {
  const { info, checking, notAvailable } = updater.value
  if (info?.version) {
    return info.version === packageInfo.version
      ? t('updater.upToDate')
      : t('updater.update', {version: info.version})
  } else {

    return checking
      ? t('updater.checking')
      : notAvailable
        ? t('updater.notAvailable')
        : t('updater.check')
  }
})

const hasUpdate = computed(() => {
  const latestVersion = updater.value.info?.version
  return !!latestVersion && latestVersion !== packageInfo.version
})

const progressPercent = computed(() => {
  return updater.value.progress?.percent / 100
})

const isDownloading = computed(() => {
  const p = progressPercent.value
  return p > 0 && p < 1
})

const downloaded = computed(() => {
  return updater.value.downloaded
})

const onAction = () => {
  if (hasUpdate.value) {
    showUpdateDialog()
  } else {
    ipcService.updater({action: 'check'})
  }
}

const showUpdateDialog = () => {
  openDialog({
    type: 'guide',
    key: 'update-info',
    icon: 'o_arrow_circle_up',
    message: [{ type: 'component', component: OUpdaterInfo }],
    ok: t('update'),
    onOk: applyUpdate,
    noShowAgain: t('updater.ignoreThisVersion'),
    onNoShowAgain: ignoreThisVersion
  })
}

const applyUpdate = () => {
  if (updater.value.downloaded) {
    ipcService.updater({
      action: 'update',
      title: t('updater.title'),
      message: t('updater.message'),
      restart: t('updater.restart'),
      later: t('updater.later'),
    })
  } else {
    notifyInfo(t('updater.downloading'))
    ipcService.updater({action: 'download'})
  }
}

const ignoreThisVersion = () => {
  setUpdater('ignore')
}

watch(downloaded, (isDone) => {
  if (isDone) showUpdateDialog()
})
</script>

<style lang="scss">
.o-update-item {
  .q-badge.dot {
    padding: 2px 3px;
    min-height: 6px;
  }
}
</style>
