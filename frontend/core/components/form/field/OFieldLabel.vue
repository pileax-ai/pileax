<template>
  <div class="col-12 o-field-label" :class="{ 'dense': dense }">
    <div class="row col-12 justify-between items-center main-label" v-if="side">
      <div class="">
        <span class="text-readable">{{label}}</span>
        <span class="text-red" v-if="required">*</span>
      </div>
      <div class="side" :class="contentClass">
        <slot></slot>
      </div>
    </div>
    <div class="main-label" v-else>
      <div class="row col-12 justify-between items-center">
        <div>
          <span class="text-readable">{{ label }}</span>
          <span class="text-red" v-if="required">*</span>
        </div>
        <div class="text-tips sub-label" v-if="subLabel">
          {{ subLabel }}
        </div>
      </div>
      <div :class="contentClass">
        <slot></slot>
      </div>
    </div>
    <div class="row items-center text-red q-mt-sm error-message" v-if="errorMessage">
      <q-icon name="error_outline" />
      <span class="q-ml-xs">{{ errorMessage }}</span>
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
.o-field-label {
  margin-top: 16px;

  &:first-child {
    margin-top: 0;
  }

  .main-label {
    font-size: 1.2rem;
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
}
</style>
