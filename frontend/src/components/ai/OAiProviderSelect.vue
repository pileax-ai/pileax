<template>
  <q-select v-model="value"
            class="o-ai-provider-select pi-field"
            input-debounce="800"
            placeholer="Select provider"
            :options="options"
            @filter="filterFn"
            @filter-abort="abortFilterFn"
            use-input standout
            map-options emit-value>
    <template #prepend>
      <q-icon name="public" />
    </template>
    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps" dense>
        <q-item-section avatar>
          <q-avatar size="48px" rounded>
            <q-icon name="public" :color="scope.opt.value" />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            {{ scope.opt.label }}
          </q-item-label>
          <q-item-label caption lines="1">
            {{ scope.opt.description }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="check" size="1rem" v-if="value === scope.opt.value" />
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { GET } from 'src/hooks/useRequest';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  level: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: ''
  }
});
const emit = defineEmits(['update:modelValue']);
const list = ref([]);
const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    const metadata = list.value.find((e: Indexable) => e.provider === value);
    emit('update:modelValue', value, metadata);
  }
});

const options = computed(() => {
  return list.value.map((item: Indexable) => {
    return {
      label: item.name,
      value: item.provider,
      description: item.description,
    }
  })
})

const filterFn = function (val: string,
                           update: (callbackFn: () => void) => void,
                           abort: () => void) {
  update(() => {
    //
  });
  abort();
}

const abortFilterFn = function () {
  console.log('delayed filter aborted')
}

onMounted(() => {
  GET({name: 'aiProvider', path: '/all'}).then(res => {
    list.value = res as [];
  })
})
</script>

<style lang="scss">
.o-ai-provider-select {
}
</style>
