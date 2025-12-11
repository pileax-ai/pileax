<template>
  <section class="library-tab">
    <section class="col-12">
      <q-list no-border link>
        <o-common-item size="4rem"
                       label="Library location"
                       sublabel="The location of book library.">
          <template #sublabel>
            <div>
              Current location: {{currentLocation}}
            </div>
          </template>
          <div>
            <q-btn class="text-tips bg-accent"
                   flat
                   @click="onChangeLibrary">
              Change
            </q-btn>
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
