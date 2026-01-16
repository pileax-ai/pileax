<template>
  <q-dialog ref="modal"
            class="library-dialog pi-card-dialog-theme"
            @hide="onHide"
            @show="onShow">
    <q-card class="dialog-card" :style="style">
      <q-bar class="bg-transparent text-readable">
        <q-icon class="title-icon" name="chrome_reader_mode" />
        <div class="title">{{ $t('reading.libraries.location') }}</div>
        <q-space />
        <q-btn icon="close" dense round flat @click="onHide" />
      </q-bar>

      <q-card-section class="dialog-content">
        <q-input ref="locationRef" v-model="location" :prefix="$t('reading.libraries.locations.new')"
                 :rules="[
                    val => (val && val.length > 0) || $t('reading.libraries.locations.choose')
                  ]"
                 :hint="`${$t('reading.libraries.locations.current')}: ${currentLocation}`"
                 outlined
                 dense>
          <template #after>
            <q-btn icon="folder_open" flat round @click="onSelectLocation" />
          </template>
        </q-input>
        <q-option-group
          v-model="type"
          type="radio"
          class="q-mt-md"
          :options="typeOptions"
          :disable="loading"
        />

        <q-inner-loading :showing="migrating">
          <q-spinner-gears size="100px" color="primary" />
        </q-inner-loading>
      </q-card-section>

      <q-card-actions class="dialog-actions"
                      align="right">
        <q-btn class="bg-accent text-readable"
               v-close-popup flat>
          {{$t('cancel')}}
        </q-btn>
        <q-btn class="bg-primary text-white"
               :loading="loading || migrating"
               @click="onOk"
               flat>
          {{$t('ok')}}
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { QInput } from 'quasar'
import { reloadApp } from 'src/app/init'
import { notifyWarning } from 'core/utils/control'
import { ipcService } from 'src/api/ipc'
import useCommon from 'core/hooks/useCommon'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  currentLocation: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['changed', 'update:modelValue'])

const { t } = useCommon()
const modal = ref()
const location = ref()
const locationRef = ref<InstanceType<typeof QInput>>()
const type = ref('move')
const loading = ref(false)
const migrating = ref(false)
const migrateResult = ref<Indexable>({
  success: true
})

const typeOptions = computed(() => {
  return  [
    { label: t('reading.libraries.locations.open'), value: 'open', color: 'indigo' },
    { label: t('reading.libraries.locations.create'), value: 'create', color: 'green' },
    { label: t('reading.libraries.locations.move'), value: 'move', color: 'blue' }
  ]
})

const style = computed(() => {
  return {
    minWidth: '600px',
    maxWidth: '800px',
    padding: '0px'
  }
})

const onSelectLocation = () => {
  loading.value = true
  ipcService.showDialog({
    properties: ['openDirectory']
  }).then(async (result: any) => {
    console.log('openDirectory', result)
    location.value = result.filePaths[0]
    loading.value = false
  }).catch((err: any) => {
    loading.value = false
  })
}

const onHide = () => {
  emit('update:modelValue', false)
}

const onShow = () => {

}

const onOk = async () => {
  locationRef.value?.validate()
  if (locationRef.value?.hasError) {
    return
  }

  const options = {
    location: location.value,
    type: type.value
  }
  console.log('options', options)
  migrating.value = true
  ipcService.migrateLibrary(options).then((res: Indexable) => {
    console.log('migrateLibrary', res)
    migrateResult.value = res
    migrating.value = false

    postMigrate(res, options)
  }).catch((err: any) => {
    migrating.value = false
  })
}

const postMigrate = async (result: Indexable, options: Indexable) => {
  if (result.success) {
    await reloadApp()
    emit('changed', options)
    onHide()
  } else {
    notifyWarning(result.message)
  }
}

watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    modal.value.show()
  } else {
    modal.value.hide()
  }
})
</script>

<style lang="scss">
.library-dialog {
  .dialog-content {
    padding: 16px 16px;
    min-height: unset!important;
    word-break: break-all;

    .content {
      font-size: 1.1rem;
    }

    .q-field__prefix {
      opacity: 0.5;
      padding-right: 10px;
    }
  }


  .q-bar {
    height: 40px;
    //margin-top: 4px;

    .title-icon {
      font-size: 1.8rem !important;
    }
    .title {
      font-size: 1.2rem;
    }
  }
}
</style>
