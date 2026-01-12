<template>
  <div class="col-12 o-field" :class="{ 'dense': dense }">
    <div class="row col-12 justify-start items-center" v-if="side">
      <div class="row col-3 main-label">
        <span>{{label}}</span>
        <span class="text-red" v-if="required">*</span>
      </div>
      <div class="col side">
        <slot></slot>
      </div>
    </div>
    <div class="row col-12 justify-start items-center" v-else>
      <div class="col-12 main-label">
        <span>{{label}}</span>
        <span class="text-red q-ml-xs" v-if="required">*</span>
      </div>
      <div class="col-12 side">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  label: {
    type: String,
    default: ''
  },
  subLabel: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  dense: {
    type: Boolean,
    default: false
  },
  side: {
    type: Boolean,
    default: false
  },
  contentClass: {
    type: String,
    default: 'q-py-sm'
  },
  errorMessage: {
    type: String,
    default: ''
  },
})
</script>

<style lang="scss">
.o-field {
  margin-top: 16px;
  margin-bottom: 20px;

  .q-field {
    margin-bottom: 0;
  }

  .main-label {
    font-size: 1rem;
    font-weight: 500;
    text-align: left;
    padding-right: 8px;
  }

  .sub-label {
    font-size: 0.8rem;
  }

  .no-padding-right {
    .q-field__control {
      padding-right: 0;
    }
  }

  &.dense {
    .side {
      font-size: 0.8rem;
    }
  }

  &.lax {
    margin-top: 32px;
  }

  &:first-of-type {
    margin-top: 0;
  }
}
</style>
