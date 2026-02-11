<template>
  <div class="o-update-info col-12">
    <o-view-item icon="o_info" :label="$t('version')" :value="info.version" right-side>
      <template #side>
        <o-chip square dense>{{updater.provider}}</o-chip>
      </template>
    </o-view-item>
    <o-view-item icon="schedule" :label="$t('time')" :value="timeMulti(info.releaseDate).timestamp()" />

    <div class="q-my-md" style="width: 100%; height: 8px;">
      <q-linear-progress :value="progressPercent" size="8px" rounded v-if="isDownloading" />
      <q-separator class="bg-dark" v-else />
    </div>

    <q-scroll-area class="release-notes">
      <o-note-viewer :content="info.releaseNotes"
                     :markdown="updater.provider === 'generic'" />
    </q-scroll-area>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import useUpdater from 'core/hooks/useUpdater'
import useCommon from 'core/hooks/useCommon'
import { timeMulti } from 'core/utils/dayjs'
import ONoteViewer from 'components/note/ONoteViewer.vue'

const { t } = useCommon()
const { updater } = useUpdater()

const info = computed(() => {
  return updater.value.info as Indexable
})

const progressPercent = computed(() => {
  return updater.value.progress?.percent / 100
})

const isDownloading = computed(() => {
  const p = progressPercent.value
  return p > 0 && p < 1
})
</script>

<style lang="scss">
.o-update-info {
  .release-notes {
    width: 100%;
    height: 180px;

    .ProseMirror {
      .o-heading-view.h1 {
        font-size: 1.6rem !important;
        font-weight: 600;
        margin: 10px 0;
        line-height: unset;
      }

      .o-heading-view.h2 {
        font-size: 1.2rem;
        font-weight: 600;
        margin: 10px 0;
        line-height: unset;
      }

      a {
        color: var(--q-primary);
      }
    }
  }
}
</style>
