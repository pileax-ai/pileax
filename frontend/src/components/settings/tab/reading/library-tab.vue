<template>
  <section class="library-tab">
    <section class="col-12">
      <q-list no-border link>
        <o-common-item size="4rem"
                       :label="$t('readings.libraries.location')"
                       :sublabel="$t('readings.libraries.location-tips')">
          <template #sublabel>
            <div>
              {{ $t('readings.libraries.locations.current') }}: {{currentLocation}}
            </div>
          </template>
          <div>
            <q-btn class="text-tips bg-accent"
                   :label="$t('actions.change')"
                   flat
                   @click="onChangeLibrary" />
          </div>
        </o-common-item>
      </q-list>
    </section>

    <library-dialog v-model="showLibraryDialog"
                    :current-location="currentLocation"
                    @changed="onLibraryChanged" />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import LibraryDialog from 'src/components/modal/LibraryDialog.vue'
import { ipcService } from 'src/api/ipc'

const currentLocation = ref()
const showLibraryDialog = ref(false)

const onChangeLibrary = () => {
  showLibraryDialog.value = true
}

const onLibraryChanged = async () => {
  currentLocation.value = await ipcService.getPath('library')
}

onMounted(() => {
  onLibraryChanged()
})
</script>

<style lang="scss">
.library-tab {
}
</style>
