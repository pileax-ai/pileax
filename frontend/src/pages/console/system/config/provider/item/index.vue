<template>
  <o-simple-form-page class="ai-provider"
                      :loading="loading"
                      @submit="onSubmit"
                      enable-actions>

    <template v-if="data.name">
      <section class="row">
        <div class="col">
          <o-view-item label="名称" :value="data.title" />
          <o-view-item label="网址" :value="data.home" :link="data.home" />
        </div>
        <div class="row col-auto items-center">
          <o-svg-icon :name="data.name" size="5rem" />
        </div>
      </section>
      <o-view-item label="简介" :value="data.description" />
    </template>

    <q-separator class="bg-accent q-my-md" />

    <section class="q-pt-md">
      <template v-for="(item, index) in config" :key="index">
        <q-select v-model="item.value"
                  :prefix="item.name"
                  class="pi-field"
                  :options="item.values"
                  standout clearable
                  v-if="item.type==='select'" />
        <q-input v-model="item.value"
                 :type="showPwd ? 'text': item.type"
                 :prefix="item.name"
                 class="pi-field"
                 standout clearable
                 v-else>
          <template v-slot:append>
            <q-icon
              :name="showPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showPwd = !showPwd"
              v-if="item.type==='password'"
            />
          </template>
        </q-input>
      </template>

      <ollama v-model="extendConfig" :data="configData" v-if="data.name==='ollama'" />
    </section>

    <section class="row col-12 justify-between connection" v-if="testable">
      <q-btn label="测试连通性" class="bg-cyan text-white" flat
             :loading="testing"
             @click="getModels" />
      <div>
        <o-badge v-bind="getArrayItem(ConnectionStatus, `${connectionStatus}`)" />
      </div>
    </section>

  </o-simple-form-page>
</template>

<script setup lang="ts">
import { onMounted, PropType, ref } from 'vue'

import OSimpleFormPage from 'core/page/template/OSimpleFormPage.vue';
import OViewItem from 'core/components/list/OViewItem.vue';
import Ollama from './ollama.vue';
import { configService } from 'src/service/remote/config';
import OBadge from 'core/components/misc/OBadge.vue'
import { GET } from 'src/hooks/useRequest'
import { ConnectionStatus, getArrayItem } from 'src/app/metadata'
import { notifyWarning } from 'core/utils/control'

const props = defineProps({
  id: {
    type: String,
    default: ''
  },
  data: {
    type: Object as PropType<Indexable>,
    default: () => {}
  }
});
const emit = defineEmits(['success']);

const config = ref<Indexable[]>([]);
const extendConfig = ref<Indexable[]>([]);
const configData = ref<Indexable[]>([]);
const models = ref<Indexable[]>([]);
const showPwd = ref(false);
const loading = ref(false);
const testable = ref(false);
const testing = ref(false);
const connectionStatus = ref(0);

function load () {
  config.value = props.data.config || [];
  getConfig();
}

function getConfig() {
  const query = {
    pageSize: 100,
    condition: {
      owner: props.data.name
    }
  }
  configService.query(query).then((res: Indexable[]) => {
    if (res.length === 0) return;
    testable.value = true;
    configData.value = res;
    for (const item of config.value) {
      const foundConfig = res.find(e => e.key === item.key);
      if (foundConfig) {
        item.value = foundConfig.value;
      }
    }
  })
}

function onSubmit () {
  loading.value = true;
  const data = [
    ...config.value,
    ...extendConfig.value
  ].map((item: Indexable) => {
    const newItem = {
      ...item,
      owner: props.data.name,
      scope: 'system'
    } as Indexable;
    delete newItem.values;
    return newItem;
  })
  configService.saveAll(data).then(res => {
    emit('success');
    testable.value = true;
    loading.value = false;
  }).catch(err => {
    loading.value = false;
  })
}

function getModels() {
  const query = { provider: props.data.name };
  testing.value = true;
  GET({ name: 'aiProvider', path: '/models', query: query }).then(res => {
    models.value = res as Indexable[];
    connectionStatus.value = 1;
    testing.value = false;
  }).catch(err => {
    connectionStatus.value = -1;
    testing.value = false;
    notifyWarning('当前大模型无法连通，请检查配置！')
  })
}

onMounted(() => {
  load();
})
</script>

<style lang="scss">
.ai-provider {
  .q-field__prefix {
    min-width: 80px;
  }

  .connection {
    .o-badge {
      padding: 8px;
      margin: 0;
      font-size: 1rem;
      .q-icon {
        font-size: 1rem;
      }
    }
  }
}
</style>
