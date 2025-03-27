<template>
  <q-select v-model="value"
            class="o-standard-color-select"
            :options="StandardColors"
            map-options emit-value>
    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section avatar>
          <q-avatar size="48px" rounded>
            <q-icon name="square" :color="scope.opt.value" />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ scope.opt.label }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="done" size="1rem" v-if="scope.opt.value === value" />
        </q-item-section>
      </q-item>
    </template>
    <template #append>
      <q-icon name="square" :color="value" v-if="value" />
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { computed, onMounted, ref} from 'vue';
import { StandardColors } from 'core/constants/metadata';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
});
const emit = defineEmits(['update:modelValue']);
const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value);
  }
})
</script>

<style lang="scss">
.o-standard-color-select {
}
</style>
