<template>
  <o-common-item icon="o_arrow_circle_up"
                 clickable right-side
                 @click="onAction">
    <template #label>
      <div v-if="percent && percent !== 1" style="width: 100%">
        <q-linear-progress :value="percent" size="8px" rounded />
      </div>
      <span v-else>
        {{ label }}
      </span>
    </template>
    <template #side>
      <o-badge color="grey">{{ packageInfo.version }}</o-badge>
    </template>
  </o-common-item>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { packageInfo } from 'core/app'
import useUpdater from 'core/hooks/useUpdater'
import useCommon from 'core/hooks/useCommon'
import { ipcService } from 'src/api/ipc'


const { t } = useCommon()
const { updater } = useUpdater()
const percent = ref(0)

const label = computed(() => {
  const info = updater.value
  if (info.version) {
    return t('updater.update', {version: info.version})
  } else {
    return info.notAvailable
      ? t('updater.notAvailable')
      : t('updater.check')
  }
})

const progressPercent = computed(() => {
  return updater.value.progress?.percent / 100
})

const onAction = () => {
  const info = updater.value
  if (info.version) {
    if (info.downloaded) {
      update()
    } else {
      ipcService.updater({action: 'download'})
    }
  } else {
    ipcService.updater({action: 'check'})
  }
}

const update = () => {
  ipcService.updater({
    action: 'update',
    title: t('updater.title'),
    message: t('updater.message'),
    restart: t('updater.restart'),
    later: t('updater.later'),
  })
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
</style>
