<template>
  <section class="all-providers-tab">
    <o-common-card small header v-if="addedProviders?.length">
      <template #header>
        <q-icon name="tune" class="icon" />
        {{ $t('ai.providers.added') }}
      </template>
      <section class="row col-12 q-col-gutter-lg">
        <template v-for="(item) in addedProviders" :key="`added-provider-${item.name}`">
          <div class="col-xl-4 col-lg-6 col-md-6 col-sm-12">
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
        <q-icon name="grid_view" class="icon" />
        {{ $t('ai.providers.available') }}
      </template>
      <template #right>
        <section class="row items-center filters">
          <div>
            <o-menu-btn :label="tag ? `${tag.label} (${tag.count})` : ''"
                        class="text-readable bg-accent"
                        menu-class="pi-menu"
                        anchor="bottom left"
                        self="top left"
                        min-width="240px"
                        flat dropdown>
              <template #menu>
                <template v-for="(item, index) in tags" :key="index">
                  <o-common-item v-bind="item"
                                 color="tips"
                                 :active="item.value === tag?.value"
                                 :side-label="item.count"
                                 @click="onSelectTag(item)"
                                 clickable closable>
                  </o-common-item>
                </template>
              </template>
            </o-menu-btn>
          </div>
          <div>
            <q-input v-model="term"
                     class="pi-field"
                     :placeholder="$t('search')"
                     standout dense clearable>
              <template #prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </section>
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
        <provider-config :id="credentialId"
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
import ProviderConfig from './children/provider-config/index.vue'
import OSideDialog from 'core/components/dialog/OSideDialog.vue'
import ONoData from 'core/components/misc/ONoData.vue'
import OMenuBtn from 'core/components/menu/OMenuBtn.vue'
import { llmService, llmProviderService } from 'src/api/service/remote'
import { providerService } from 'src/api/service/remote/provider'
import { providerCredentialService } from 'src/api/service/remote/provider-credential'
import { notifyDone } from 'core/utils/control'
import useCommon from 'core/hooks/useCommon'
import useAi from 'src/hooks/useAi'

const $q = useQuasar()
const { t } = useCommon()
const { getDefaultModels } = useAi()
const myProviders = ref<Indexable[]>()
const providers = ref<Indexable[]>()
const provider = ref<Indexable>()
const credentialId = ref('')
const term = ref('')
const currentTag = ref('')
const view = ref('api-key')
const side = reactive<Indexable>({
  show: false,
  title: 'Provider Settings',
  icon: 'vpn_key',
  position: 'standard',
  style: {width: '30vw', minWidth: '600px'},
  contentClass: 'card pi-card-dialog-theme'
})

const addedProviderNames = computed(() => {
  return  new Set(myProviders.value?.map(p => p.provider))
})

const addedProviders = computed(() => {
  return myProviders.value?.map(p => {
    const providerInfo = providers.value?.find(item => item.name === p.provider) || {}
    return {
      ...providerInfo,
      ...p,
    }
  })
})

const availableProviders = computed(() => {
  return providers.value?.filter(p => !addedProviderNames.value.has(p.name))
})

const filteredProviders = computed(() => {
  const filteredByName = term.value
    ? availableProviders.value?.filter(p => p.name.toLowerCase().indexOf(term.value) >= 0)
    : availableProviders.value
  return currentTag.value
    ? filteredByName?.filter(p => p.tags.split(',').includes(currentTag.value))
    : filteredByName
})

const tags = computed(() => {
  let list = [] as Indexable[]
  if (availableProviders.value) {
    const tagCounts: Record<string, number> = {}
    for (const item of availableProviders.value) {
      if (!item.tags) continue

      // Split tags by comma, trim whitespace, and ignore empty strings
      const tags = item.tags
        .split(',')
        .map((tag: string) => tag.trim())
        .filter(Boolean)

      // Deduplicate tags within the same item to avoid overcounting
      const uniqueTags = new Set<string>(tags)

      for (const tag of uniqueTags) {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      }
    }
    list = Object.entries(tagCounts).map(([label, value]) => ({
      label,
      value: label,
      count: value
    }))
  }

  list.unshift({
    label: t('all'),
    value: '',
    count: availableProviders.value?.length ?? 0
  })
  return list
})

const tag = computed(() => {
  return tags.value.find(item => item.value === currentTag.value)
})

const onSelectTag = (tag: Indexable) => {
  currentTag.value = tag.value
}

const getAllProviders = () => {
  llmProviderService.getProviders().then(res => {
    providers.value = res
  })
}

const getAddedProviders = () => {
  providerService.getAll().then(res => {
    myProviders.value = res
  })
}

const initData = () => {
  currentTag.value = ''
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
    class: 'pi-dialog-theme',
    title: t('confirm'),
    message: `${t('deleteConfirm')} <div class="tag">${credential.name}</div>`,
    html: true,
    cancel: true
  }).onOk( () => {
    providerCredentialService.delete(credential.id).then(res => {
      initData()
      getDefaultModels()
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
    class: 'pi-dialog-theme',
    title: t('confirm'),
    message: `${t('deleteConfirm')} <div class="tag">${item.name}</div>`,
    html: true,
    cancel: true
  }).onOk( () => {
    providerService.delete(item.id).then(res => {
      getAddedProviders()
      getDefaultModels()
      notifyDone()
    })
  })
}

const onClose = () => {
  side.show = false
  initData()
  getDefaultModels()
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

  .filters {
    gap: 12px;

    .o-menu-btn {
      min-height: 40px;
    }
  }
}
</style>
