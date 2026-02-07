<template>
  <div class="o-update-info col-12">
    <o-view-item icon="o_info" :label="$t('version')" :value="info.releaseName" />
    <o-view-item icon="schedule" :label="$t('time')" :value="timeMulti(info.releaseDate).timestamp()" />

    <q-separator class="bg-dark q-mt-md q-mb-xs" />

    <q-scroll-area class="release-notes">
      <div v-html="info.releaseNotes"></div>
    </q-scroll-area>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import useUpdater from 'core/hooks/useUpdater'
import useCommon from 'core/hooks/useCommon'
import { timeMulti } from 'core/utils/dayjs'


const { t } = useCommon()
const { updater } = useUpdater()

const info = computed(() => {
  return updater.value.info as Indexable
})

</script>

<style lang="scss">
.o-update-info {
  .release-notes {
    width: 100%;
    height: 180px;

    h1 {
      font-size: 1.6rem;
      font-weight: 600;
      margin: 10px 0;
      line-height: unset;
    }

    h2 {
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
</style>
