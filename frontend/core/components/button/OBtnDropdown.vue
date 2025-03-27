<template>
  <q-btn-dropdown class="o-btn-dropdown"
                  :class="itemClass"
                  :label="label"
                  no-caps unelevated>
    <q-list>
      <q-item v-for="(item, index) in items" :key="index"
              clickable
              v-close-popup @click="emit('select', item)">
        <q-item-section avatar>
          <q-icon :name="item.icon" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ item.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
import { PropType } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  items: {
    type: Array as  PropType<Indexable[]>,
    required: true
  },
  itemClass: {
    type: String,
    default: ''
  }
});
const emit = defineEmits(['select']);
</script>
