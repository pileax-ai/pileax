<template>
  <section class="ai-provider-ollama">
    <template v-for="(item, index) in list" :key="index">
      <q-select v-model="item.value"
                :prefix="item.name"
                class="pi-field"
                :options="item.values"
                standout clearable
                @update:modelValue="onUpdate"
                v-if="item.type==='select'" />
      <q-input v-model="item.value"
               :prefix="item.name"
               class="pi-field"
               standout clearable
               v-else />
    </template>
  </section>
</template>

<script setup lang="ts">
import { onMounted, PropType, ref, watch } from 'vue'
import { configService } from 'src/api/service/remote/config';
import { GET } from 'src/hooks/useRequest'
import { notifyWarning } from 'core/utils/control'

const props = defineProps({
  modelValue: {
    type: Array as PropType<Indexable[]>,
    default: () => []
  },
  data: {
    type: Array as PropType<Indexable[]>,
    default: () => []
  }
});
const emit = defineEmits(['update:modelValue']);

const models = ref<Indexable[]>([]);
const list = ref<Indexable[]>([
  {
    "name": "model",
    "type": "select",
    "key": "OLLAMA_MODEL",
    "value": "",
    "values": [
    ]
  },
]);

function getModels() {
  const query = { provider: 'ollama' };
  GET({ name: 'aiProvider', path: '/models', query: query }).then(res => {
    models.value = res as Indexable[];

    const model = list.value.find(e => e.name === 'model');
    if (model) {
      model.values = models.value.map(e => e.model);
    }
  })
}

function init() {
  load();
  emit('update:modelValue', list.value);
  getModels();
}

function load() {
  for (const item of list.value) {
    const foundConfig = props.data.find(e => e.key === item.key);
    if (foundConfig) {
      item.value = foundConfig.value;
    }
  }
}

function onUpdate() {
  emit('update:modelValue', list.value);
}

watch(() => props.data, (newValue) => {
  load();
});

onMounted(() => {
  init();
})
</script>

<style lang="scss">
.ai-provider-ollama {
}
</style>
