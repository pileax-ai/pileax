<template>
  <section class="all-providers-tab">
    <o-common-card small header v-if="addedProviders?.length">
      <template #header>
        <q-icon name="tune"/>Added Providers
      </template>
      <section class="row col-12 q-col-gutter-lg">
        <template v-for="(item) in addedProviders" :key="`added-provider-${item.name}`">
          <div class="col-xl-4 col-lg-6 col-md-12 col-sm-12">
            <added-provider-card :data="item"
                                 @add="onAdd(item)"
                                 @edit="onEdit($event, item)"
                                 @delete="onDelete"
                                 @active-credential="onActiveCredential($event, item)"
                                 @remove-provider="onRemoveProvider(item)" />
          </div>
        </template>
      </section>
    </o-common-card>

    <o-common-card small header>
      <template #header>
        <q-icon name="grid_view"/>Available Providers
      </template>
      <template #right>
        <q-input v-model="term"
                 class="pi-field"
                 placeholder="Search"
                 standout dense clearable>
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <section class="col-12 pi-view-grid" v-if="filteredProviders?.length">
        <template v-for="(item) in filteredProviders" :key="`available-provider-${item.name}`">
          <div class="">
            <provider-card :data="item" @add="onAdd(item)" />
          </div>
        </template>
      </section>
      <o-no-data image v-else />
    </o-common-card>

    <o-side-dialog v-bind="side"
                   :seamless="false"
                   scrollable
                   @show="side.show = true"
                   @close="onSideClose">
      <template #content>
        <provider-api-key :id="credentialId"
                          :data="provider"
                          @success="onClose"
                          v-if="view === 'api-key'" />
      </template>
    </o-side-dialog>
  </section>
</template>

<script setup lang="ts">
import { computed, onActivated, reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import AddedProviderCard from './children/AddedProviderCard.vue'
import ProviderCard from './children/ProviderCard.vue'
import ProviderApiKey from './children/ProviderApiKey.vue'
import OSideDialog from 'core/components/dialog/OSideDialog.vue'
import { llmService } from 'src/api/service/remote/llm'
import { providerService } from 'src/api/service/remote/provider'
import { providerCredentialService } from 'src/api/service/remote/provider-credential'
import { notifyDone } from 'core/utils/control'
import ONoData from 'core/components/misc/ONoData.vue'

const $q = useQuasar()
const myProviders = ref<Indexable[]>()

const providers = ref<Indexable[]>()
const provider = ref<Indexable>()
const credentialId = ref('')
const term = ref('')
const view = ref('api-key')
const side = reactive<Indexable>({
  show: false,
  title: 'Provider Settings',
  icon: 'vpn_key',
  position: 'standard',
  style: {width: '30vw', minWidth: '600px'},
  contentClass: 'card'
})

const addedProviderNames = computed(() => {
  return  new Set(myProviders.value?.map(p => p.provider))
})

const addedProviders = computed(() => {
  return myProviders.value?.map(p => {
    const providerInfo = providers.value?.find(item => item.name === p.provider) || {}
    return {
      ...p,
      ...providerInfo
    }
  })
})

const availableProviders = computed(() => {
  return providers.value?.filter(p => !addedProviderNames.value.has(p.name))
})

const filteredProviders = computed(() => {
  return term.value
    ? availableProviders.value?.filter(p => p.name.toLowerCase().indexOf(term.value) >= 0)
    : availableProviders.value
})

const getAllProviders = () => {
  llmService.getProviders().then(res => {
    providers.value = res
  })
}

const getAddedProviders = () => {
  providerService.getAll().then(res => {
    myProviders.value = res
  })
}

const initData = () => {
  getAllProviders()
  getAddedProviders()
}

const onAdd = (item: Indexable) => {
  provider.value = item
  side.show = true
  side.icon = `icon-${item.logo}`
  side.title = item.name
  view.value = 'api-key'
}

const onEdit = (credential: Indexable, item: Indexable) => {
  credentialId.value = credential.id
  onAdd(item)
}

const onDelete = (credential: Indexable) => {
  $q.dialog({
    title: '确认',
    message: `你确定删除该配置吗？[${credential.name}]`,
    cancel: true
  }).onOk( () => {
    providerCredentialService.delete(credential.id).then(res => {
      getAddedProviders()
      notifyDone()
    })
  })
}

const onActiveCredential = (credential: Indexable, item: Indexable) => {
  providerService.update({
    id: item.id,
    credentialId: credential.id
  }).then(res => {
    getAddedProviders()
    notifyDone()
  })
}

const onRemoveProvider = (item: Indexable) => {
  $q.dialog({
    title: '确认',
    message: `你确定删除该提供商吗？[${item.name}]`,
    cancel: true
  }).onOk( () => {
    providerService.delete(item.id).then(res => {
      getAddedProviders()
      notifyDone()
    })
  })
}

const onClose = () => {
  side.show = false
  getAddedProviders()
}

const onSideClose = () => {
  side.show = false
  view.value = ''
  credentialId.value = ''
  provider.value = {}
}

onActivated(() => {
  initData()
})
</script>

<style lang="scss">
.all-providers-tab {
  .o-common-card .card-content {
    padding: 1rem 0;
  }
}
</style>
