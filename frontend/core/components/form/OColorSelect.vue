<template>
  <section class="o-color-select">
    <template v-for="(item, index) in StandardColors" :key="index">
      <q-icon :name="item.value ? 'circle' : 'hide_source'"
              :color="item.color"
              :class="{'active': item.value===color}"
              @click="onSelect(item)">
        <o-tooltip>{{item.label}}</o-tooltip>
      </q-icon>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import useMetadata from 'src/hooks/useMetadata'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['update:modelValue'])

const { StandardColors } = useMetadata()

const color = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    console.log('select color', value)
    emit('update:modelValue', value)
  }
})

const onSelect = (item: Indexable) => {
  color.value = item.value
}
</script>

<style lang="scss">
.o-color-select {
  .q-icon {
    font-size: 24px;
    padding: 4px;
    margin: 4px 4px 0 0;
    border-radius: 50%;
    cursor: pointer;

    &.active {
      font-size: 24px;
      padding: 1px;
      border: 3px solid rgba(black, 0.2);
    }
  }
}
</style>
