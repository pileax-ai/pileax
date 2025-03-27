<template>
  <q-select v-model="value"
            class="o-industry-select"
            :prefix="value ? '' : '行业'"
            input-debounce="800"
            :options="options"
            @filter="filterFn"
            @filter-abort="abortFilterFn"
            use-input
            use-chips
            map-options emit-value>
    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section avatar v-if="false">
          <q-avatar size="48px" rounded>
            <q-icon name="square" :color="scope.opt.value" />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ scope.opt.label }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          {{ getArrayItem(IndustryStandards, scope.opt.type).abbr }}
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { computed, ref} from 'vue';
import { POST } from 'src/hooks/useRequest';
import { getArrayItem, IndustryStandards} from 'src/app/metadata';

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
const options = ref([]);
const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value);
  }
})

const filterFn = function (val, update, abort) {
  update(async () => {
    const needle = val.toLowerCase();
    const body = {
      pageSize: 100,
      condition: {
        name: needle,
        type: props.type,
        level: props.level
      }
    };
    try {
      const data = await POST({name: 'baseIndustry', path: '/query', body: body})
      options.value = data.list.map(e => {
        return {
          label: e.name,
          value: e.pcode,
          type: e.type
        }
      });
    } catch (err) {
      abort();
    }
  })
}

const abortFilterFn = function () {
  console.log('delayed filter aborted')
}
</script>

<style lang="scss">
.o-industry-select {
}
</style>
