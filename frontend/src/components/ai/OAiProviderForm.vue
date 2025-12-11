<template>
  <q-form class="o-ai-provider-form" @submit="onSave">
    <div class="row col-12 q-col-gutter-md">
      <template v-for="(item, index) in config" :key="index">
        <div class="col-6">
          <q-select v-model="item.value"
                    :label="item.name"
                    class="pi-field"
                    :options="item.values"
                    standout clearable
                    v-if="item.type==='select'" />
          <q-input v-model="item.value"
                   :type="showPwd ? 'text': item.type"
                   :label="item.name"
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
        </div>
      </template>
    </div>
    <footer class="row col-12 justify-center">
      <q-btn type="submit"
             label="保存"
             class="bg-primary text-white save"
             :loading="loading"
             flat />
    </footer>
  </q-form>
</template>

<script setup lang="ts">
import type { PropType} from 'vue';
import { onMounted, ref, watch } from 'vue';
import { configService } from 'src/api/service/remote/config';
import { notifyDone } from 'core/utils/control'

const props = defineProps({
  provider: {
    type: Object as PropType<Indexable>,
    default: () => {}
  },
});
const emit = defineEmits(['select']);

const loading = ref(false);
const showPwd = ref(false);
const config = ref<Indexable[]>([]);

function initConfig() {
  config.value = props.provider.config || [];
  console.log('config', config.value);
  getConfig();
}

function getConfig() {
  const query = {
    pageSize: 100,
    condition: {
      owner: props.provider.name
    }
  }
  configService.query(query).then((res: Indexable[]) => {
    for (const item of config.value) {
      const foundConfig = res.find(e => e.key === item.key);
      if (foundConfig) {
        item.value = foundConfig.value;
      }
    }
  })
}

function onSave() {
  loading.value = true;
  const data = config.value.map((item: Indexable) => {
    const newItem = {
      ...item,
      owner: props.provider.name,
      scope: 'system'
    } as Indexable;
    delete newItem.values;
    return newItem;
  })
  configService.saveAll(data).then(res => {
    notifyDone();
    loading.value = false;
  }).catch(err => {
    loading.value = false;
  })
}

watch(() => props.provider, (newValue) => {
  initConfig();
})

onMounted(() => {
  initConfig();
})
</script>

<style lang="scss">
.o-ai-provider-form {
  position: relative;

  footer {
    padding-top: 2rem;
    .q-btn {
      min-width: 120px;
    }
  }
}
</style>
