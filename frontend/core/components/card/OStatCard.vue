<template>
  <q-card class="o-stat-card" :class="{ 'bg-accent': accent }" flat>
    <template v-if="skeleton">
      <q-card-section class="text-tips header">
        <q-skeleton type="text" width="60px" />
      </q-card-section>
      <q-card-section class="row justify-between primary">
        <div class="value">
          <q-skeleton type="text" width="100px" />
        </div>
        <div>
          <q-skeleton type="QAvatar" />
        </div>
      </q-card-section>
      <q-separator class="bg-accent" />
      <q-card-section class="row secondary">
        <span class="label"><q-skeleton type="text" width="60px" /></span>
        <span class="value"><q-skeleton type="text" width="40px" /></span>
      </q-card-section>
    </template>
    <template v-else>
      <q-card-section class="text-tips header">
        {{ label }}
      </q-card-section>
      <q-card-section class="row justify-between primary">
        <div class="value">
          <count-to :startVal="0"
                    :endVal="value"
                    :decimals="0"
                    :duration="1000" class="text-bold" />
        </div>
        <div>
          <q-avatar :icon="icon" :color="color" text-color="white" />
        </div>
      </q-card-section>
      <q-separator class="bg-accent" />
      <q-card-section class="secondary">
        <span class="label">{{ subLabel }}</span>
        <span class="value">{{ subValue }}</span>
      </q-card-section>
    </template>
  </q-card>
</template>

<script setup lang="ts">
import { CountTo } from 'vue3-count-to'

defineProps({
  skeleton: {
    type: Boolean,
    default: false
  },
  label: {
    default: 'Label'
  },
  value: {
    type: Number,
    default: 0
  },
  subLabel: {
    default: 'Label'
  },
  subValue: {
    default: ''
  },
  icon: {
    type: String,
    default: 'apps'
  },
  color: {
    type: String,
    default: 'blue'
  },
  accent: {
    type: Boolean,
    default: false
  },
})
</script>

<style lang="scss">
.o-stat-card {
  .header {
    padding-bottom: 4px;
  }
  .primary {
    padding-top: 0;
    .value {
      font-size: 2.4rem;
    }
  }
  .secondary {
    .value {
      margin-left: 1rem;
    }
  }
}
</style>
