<template>
  <o-common-dialog class="connect-dialog dialog-theme"
                   :ok="dialog.ok"
                   :show="dialog.type === 'connect'"
                   :content-style="style"
                   @close="onHide"
                   @ok="onConfirm"
                   show-cancel
                   show-ok>
    <header class="row justify-center items-center" v-touch-pan.prevent.mouse="onPan">
      <q-icon :name="connected ? 'mdi-access-point' : 'mdi-access-point-off'" />
    </header>
    <section class="content">
      <q-banner rounded class="bg-accent text-readable" inline-actions>
        <template v-slot:avatar>
          <q-icon :name="mode?.icon" color="primary" size="1.4rem" />
        </template>
        {{ mode?.tooltip }}
      </q-banner>

      <div class="message row col-12 items-center q-mt-md">
        <o-field :label="$t('app.mode')" class="col-12" side v-if="ipcProvider === 'web'">
          <div class="row col-12 justify-between">
            <o-chip :icon="mode?.icon" square>{{ mode?.label }}</o-chip>
            <q-btn icon="restart_alt" :label="$t('app.resetDefault')"
                   class="bg-accent text-readable"
                   flat
                   @click="onReset" />
          </div>
        </o-field>
        <o-field :label="$t('app.mode')" class="col-12" side v-else>
          <q-btn-group flat>
            <template v-for="(item, index) in modes" :key="index">
              <q-btn :icon="item.icon"
                     :label="item.label"
                     :class="form.mode === item.value ? `bg-primary text-white` : 'bg-dark'"
                     @click="form.mode = item.value" />
            </template>
          </q-btn-group>
        </o-field>

        <o-field :label="$t('app.api.baseUrl')" class="col-12" side
                 v-if="form.mode !== 'standalone'">
          <q-input v-model="form.baseUrl"
                   class="pi-field"
                   standout dense clearable
                   @update:modelValue="testStatus = 0">
            <template #after>
              <q-btn :icon="testIcon"
                     :label="$t('test')"
                     class="bg-primary text-white test"
                     flat
                     @click="onTest"
                     v-if="needTest" />
            </template>
          </q-input>
        </o-field>

        <o-field :label="$t('app.api.collabUrl')" class="col-12" side
                 v-if="form.mode !== 'standalone'">
          <q-input v-model="form.collabProvider"
                   class="pi-field"
                   standout dense clearable>
          </q-input>
        </o-field>
      </div>
    </section>

    <template #left-actions>
      <div class="row items-center">
        <q-icon name="circle" :color="connected ? 'green' : 'red'" size="10px" />
        <span class="q-ml-xs">
          {{ connected ? $t('app.connected') : $t('app.disconnected') }}
        </span>
      </div>
    </template>
  </o-common-dialog>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, reactive, ref } from 'vue'
import { useQuasar } from 'quasar'

import OCommonDialog from 'core/components/dialog/OCommonDialog.vue'
import useDialog from 'core/hooks/useDialog'
import useApi from 'src/hooks/useApi'
import useCommon from 'core/hooks/useCommon'
import { ipcProvider, ipcService } from 'src/api/ipc'
import { getRequest } from 'src/api/server/api'
import { resetAccount } from 'src/app/destroy'
import { notifyDone, notifyWarning } from 'core/utils/control'
import { getRootDomain } from 'core/utils/url'

const $q = useQuasar()
const { dialog, onHide, onOk } = useDialog()
const {
  appMode,
  setAppMode,
  apiBase,
  collabProvider,
  connected,
  setApiBase,
  setCollab,
  setCollabProvider
} = useApi()
const { t } = useCommon()
const pos = reactive({ x: 0, y: 0 })
const form = ref({
  mode: '',
  baseUrl: '',
  collabProvider: '',
})
const testStatus = ref(0)

const testIcon = computed(() => {
  switch (testStatus.value) {
    case -1:
      return 'close'
    case 1:
      return 'done'
    default:
      return 'circle'
  }
})

const testPassed = computed(() => {
  return testStatus.value === 1
})

const modeChanged = computed(() => {
  return form.value.mode !== appMode.value
})

const mode = computed(() => {
  return modes.value.find(m => m.value === form.value.mode)
})

const baseUrlChanged = computed(() => {
  return form.value.baseUrl !== apiBase.value
})

const baseUrlHostname = computed(() => {
  return getRootDomain(form.value.baseUrl)
})

const collabProviderHostname = computed(() => {
  return getRootDomain(form.value.collabProvider)
})

const style = computed(() => {
  return {
    minWidth: '540px',
    maxWidth: '540px',
    padding: '0px',
    transform: `translate(${pos.x}px, ${pos.y}px)`
  }
})

const modes = computed(() => {
  return [
    {
      label: t('app.modes.standalone'),
      value: 'standalone',
      icon: 'o_domain',
      tooltip: t('app.modes.standaloneDesc')
    },
    {
      label: t('app.modes.cloud'),
      value: 'cloud',
      icon: 'o_cloud',
      tooltip: t('app.modes.cloudDesc')
    },
  ]
})

const needTest = computed(() => {
  return form.value.mode === 'cloud'
    && baseUrlChanged.value
})

const onPan = (evt: any) => {
  pos.x += evt.delta.x
  pos.y += evt.delta.y
}

const onReset = () => {
  form.value.baseUrl = window.APP_CONFIG?.API_BASE_URL
    || process.env.API_BASE_URL
    || apiBase.value
    || ''
  form.value.collabProvider = window.APP_CONFIG?.COLLAB_PROVIDER_URL
    || process.env.COLLAB_PROVIDER_URL
    || collabProvider.value
    || 'ws://localhost:9611'
}

const onTest = () => {
  getRequest({
    name: form.value.baseUrl,
    path: '/system/health-check'
  }).then(res => {
      testStatus.value = 1
      notifyDone()
    })
    .catch(() => {
      testStatus.value = -1
      notifyWarning(t('app.unableConnect'))
    })
}

const testCloudMode = () => {
  if (modeChanged.value && !baseUrlChanged.value) {
    notifyWarning(t('app.newBaseUrlRequired'))
    return false
  }
  if (baseUrlChanged.value && !testPassed.value) {
    notifyWarning(t('app.connectTestFailed'))
    return false
  }
  if (baseUrlHostname.value !== collabProviderHostname.value) {
    notifyWarning(t('app.domainMismatch'))
    return false
  }
  return true
}

const onConfirm = () => {
  const newMode = modes.value.find(m => m.value === form.value.mode)
  if (!newMode) return
  if (newMode.value === 'cloud' && !testCloudMode()) {
    return
  }

  // Change app mode
  if (modeChanged.value) {
    $q.dialog({
      class: 'pi-dialog-theme',
      title: t('confirm'),
      message: `${t('app.modes.changingMode')}:
        <span  class="tag">${newMode.label}</span><br/><br/>
        <div>${t('app.restartTakeEffect')}</div>`,
      html: true,
      cancel: true
    }).onOk( async () => {
      // Apply new values
      await resetAccount()
      setAppMode(form.value.mode)

      // Enable collab in cloud mode by default
      if (newMode.value === 'cloud') {
        setApiBase(form.value.baseUrl)
        setCollab(true)
        setCollabProvider(form.value.collabProvider)
      } else {
        setCollab(false)
      }

      // Restart app to take effect
      await ipcService.setAppMode(form.value.mode as 'standalone' | 'cloud')
      setTimeout(async () => {
        await ipcService.restart()
      }, 500)
    })
  } else {
    // Change base url (cloud mode)
    if (baseUrlChanged.value) {
      $q.dialog({
        class: 'pi-dialog-theme',
        title: t('confirm'),
        message: `${t('app.modes.changingUrl')}: <span  class="tag">${form.value.baseUrl}</span><br/><br/>
        <div>${t('app.restartTakeEffect')}</div>`,
        html: true,
        cancel: true
      }).onOk( async () => {
        await resetAccount()

        // Enable collab in cloud mode by default
        if (newMode.value === 'cloud') {
          setApiBase(form.value.baseUrl)
          setCollab(true)
          setCollabProvider(form.value.collabProvider)
        } else {
          setCollab(false)
        }

        // Restart app to take effect
        setTimeout(async () => {
          await ipcService.restart()
        }, 500)
      })
    } else {
      onOk()
    }
  }
}



onBeforeMount(() => {
  form.value = {
    mode: appMode.value,
    baseUrl: apiBase.value || '',
    collabProvider: collabProvider.value
  }
})
</script>

<style lang="scss">
@import "./dialog-theme";
.connect-dialog {
  .q-banner {
    &__avatar {
      align-self: center;
    }
  }
  .message {
    .o-field {
      margin-bottom: 0;

      .main-label {
        font-size: 1rem;
        font-weight: normal;
        width: 100px;
      }

      .test {
        .q-icon {
          font-size: 14px;
        }
      }
    }
  }
}
</style>
