<template>
  <o-common-item class="o-update-item"
                 icon="o_arrow_circle_up"
                 clickable right-side
                 @click="onAction">
    <template #label>
      <div v-if="percent && percent !== 1" style="width: 100%">
        <q-linear-progress :value="percent" size="8px" rounded />
      </div>
      <div class="row items-center" v-else>
        <div>{{ label }}</div>
        <q-badge color="red" rounded align="middle" class="dot q-ml-xs" />
      </div>
    </template>
    <template #side>
      <o-badge v-if="downloaded">{{ $t('ready') }}</o-badge>
      <o-badge color="grey" v-else>{{ packageInfo.version }}</o-badge>
    </template>
  </o-common-item>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { packageInfo } from 'core/app'
import useUpdater from 'core/hooks/useUpdater'
import useCommon from 'core/hooks/useCommon'
import useDialog from 'core/hooks/useDialog'
import { ipcService } from 'src/api/ipc'

import OUpdaterInfo from 'components/app/updater/OUpdaterInfo.vue'

const { t } = useCommon()
const { openDialog } = useDialog()
const { updater, setUpdater } = useUpdater()
const percent = ref(0)

const label = computed(() => {
  const info = updater.value.info
  const notAvailable = updater.value.notAvailable
  if (info?.version) {
    return t('updater.update', {version: info.version})
  } else {
    return notAvailable
      ? t('updater.notAvailable')
      : t('updater.check')
  }
})

const progressPercent = computed(() => {
  return updater.value.progress?.percent / 100
})

const downloaded = computed(() => {
  return updater.value.downloaded
})

const onAction = () => {
  const info = updater.value.info
  const downloaded = updater.value.downloaded
  if (info?.version) {
    // if (downloaded) {
    //   update()
    // } else {
    //   ipcService.updater({action: 'download'})
    // }
    update()
  } else {
    ipcService.updater({action: 'check'})
  }
}

const update = () => {
  openDialog({
    type: 'guide',
    key: 'update-info',
    icon: 'o_arrow_circle_up',
    message: [
      {
        type: 'component',
        component: OUpdaterInfo
      }
    ],
    ok: t('update'),
    onOk: applyUpdate,
    noShowAgain: t('updater.ignoreThisVersion'),
    onNoShowAgain: ignoreThisVersion
  })
}

const applyUpdate = () => {
  console.log('update', updater.value)
  ipcService.updater({
    action: 'update',
    title: t('updater.title'),
    message: t('updater.message'),
    restart: t('updater.restart'),
    later: t('updater.later'),
  })
}

const ignoreThisVersion = () => {
  setUpdater('ignore')
}

watch(progressPercent, (newValue) => {
  percent.value = newValue
  if (newValue === 1) {
    update()
  }
})

onMounted(() => {
  percent.value = progressPercent.value || 0
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
