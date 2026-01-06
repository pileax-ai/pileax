<template>
  <o-common-page class="page-test" scrollable>
    <o-common-card class="row col-12 items-end app">
      <section class="">
        <div class="name">
          {{$t('product.name')}}
        </div>
        <div>
          Just a test
        </div>
      </section>
    </o-common-card>

    <section class="relative-position col-12 navi-card">
      <section class="row col-12 q-col-gutter-lg">
        <section class="col-12">
          <o-common-card title="Notify" header>
            <section class="row col-12 items-center q-col-gutter-md q-pa-md">
              <div style="width: 100px;">Center</div>
              <div>
                <q-btn color="cyan" label="Done" @click="notify('done')" />
              </div>
            </section>
            <section class="row col-12 items-center q-col-gutter-md q-pa-md">
              <div style="width: 100px;">Top</div>
              <div>
                <q-btn color="blue" label="Info" @click="notify('info')" />
              </div>
              <div>
                <q-btn color="positive" label="Success" @click="notify('success')" />
              </div>
              <div>
                <q-btn color="warning" label="Warning" @click="notify('warning')" />
              </div>
              <div>
                <q-btn color="negative" label="Error" @click="notify('error')" />
              </div>
            </section>
            <section class="row col-12 q-col-gutter-md q-pa-md">
              <div style="width: 100px;">Top right</div>
              <div>
                <q-btn color="blue" label="Info" @click="notify('info', 'top-right')" />
              </div>
              <div>
                <q-btn color="positive" label="Success" @click="notify('success', 'top-right')" />
              </div>
              <div>
                <q-btn color="warning" label="Warning" @click="notify('warning', 'top-right')" />
              </div>
              <div>
                <q-btn color="negative" label="Error" @click="notify('error', 'top-right')" />
              </div>
            </section>
          </o-common-card>
        </section>

        <section class="col-12">
          <o-common-card title="IPC Service" header>
            <section class="row col-12 items-center q-col-gutter-md q-pa-md">
              <div v-for="(item, index) in ipcCases" :key="index">
                <q-btn :label="item.label" @click="ipcCall(item.label,item.args)" />
              </div>
            </section>
          </o-common-card>
        </section>
        <section class="col-12">
          <o-common-card title="Remote API" header>
            <section class="row col-12 items-center q-col-gutter-md q-pa-md">
              <div style="width: 100px;">Edge</div>
              <div>
                <q-btn color="blue" label="getVoices" @click="getEdgeVoices" :loading="loading.edgeVoices" />
              </div>
              <div>
                <q-btn color="indigo" label="tts" @click="edgeTTS" :loading="loading.edgeTTS" />
              </div>
            </section>
          </o-common-card>
        </section>
        <section class="col-12">
          <o-common-card title="ENV" header>
            <section class="row col-12 items-center q-pa-md">
              <ul>
                <li>apiBase: {{apiBase}}</li>
                <li>appBase: {{appBase}}</li>
                <template v-for="(value, key) in env" :key="key">
                  <li>
                    {{key}}: {{value}}
                  </li>
                </template>
              </ul>
            </section>
          </o-common-card>
        </section>
      </section>
    </section>
  </o-common-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import OCommonPage from 'core/page/template/OCommonPage.vue'
import { notifyDone, notifyError, notifyInfo, notifySuccess, notifyWarning } from 'core/utils/control'
import { ipcService, ipcMethod } from 'src/api/ipc'
import { edgeService } from 'src/api/service/remote/edge'
import { api as request } from 'boot/axios'
import useApi from 'src/hooks/useApi'

const { apiBase, appBase } = useApi()

const loading = ref<Indexable>({
  edgeVoices: false,
  edgeTTS: false,
})

const env = computed(() => {
  return process.env
})

const ipcCases = computed(() => {
  return [
    { label: 'hi', args: 'hi' },
    { label: 'isWindowMaximized', args: '' },
    { label: 'maximizeWindow', args: '' },
    { label: 'minimizeWindow', args: '' },
    { label: 'showDialog', args: { properties: ['openDirectory'] } },
    { label: 'setTheme', args: 'dark' },
  ]
})

const notify = (type: string, position = 'top') => {
  switch (type) {
    case 'info':
      notifyInfo('This is a NORMAL notification', {
        position: position
      })
      break
    case 'success':
      notifySuccess('This is an SUCCESS notification', {
        position: position
      })
      break
    case 'warning':
      notifyWarning('This is an WARNING notification', {
        position: position
      })
      break
    case 'done':
      notifyDone()
      break
    case 'error':
      notifyError('This is an ERROR notification', {
        position: position
      })
      break
  }
}

const ipcCall = async (name: string, args?: any) => {
  const res = await ipcMethod(ipcService, name, args)
  console.log(name, res)
  notifyInfo(`${res}`)
}

const getEdgeVoices = () => {
  loading.value.edgeVoices = true
  edgeService.getVoices().then(res => {
    console.log('voices', res)
  }).finally(() => {
    loading.value.edgeVoices = false
  })
}

const edgeTTS = async () => {
  const body = {
    text: '这是一个测试',
    voice: 'zh-CN-XiaoxiaoNeural',
    rate: '+0%'
  }

  try {
    loading.value.edgeTTS = true
    const res = await edgeService.tts(body, 'blob')
    const blob = res.data
    console.log('blob', blob)
  } finally {
    loading.value.edgeTTS = false
  }

}
</script>

<style lang="scss">
.page-test {
  .app {
    min-height: 80px;
    padding: 21px 21px;

    .name {
      font-size: 48px;
    }
  }

  .navi-card {
    padding: 21px;
  }

  .o-common-card {
    .title {
      font-size: 18px;
    }
  }

}

.mobile {
  .page-test {
    .app {
      padding: 0 16px;
      .name {
        font-size: 32px;
      }
    }

    .navi-card {
      padding: 16px;
    }
  }
}
</style>
