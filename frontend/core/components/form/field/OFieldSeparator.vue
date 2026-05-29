<template>
  <div class="row items-center o-field-separator" :class="`justify-${align}`">
    <q-separator class="col start" v-if="align !== 'start'" />
    <div class="label text-tips" :class="align">
      {{ label }}
    </div>
    <q-separator class="col end" v-if="align !== 'end'" />
  </div>
</template>

<script setup lang="ts">
defineProps({
  label: {
    type: String,
    default: ''
  },
  align: {
    type: String,
    default: 'start'
  },
  separatorClass: {
    type: String,
    default: ''
  },
})
</script>

<style lang="scss">
.o-field-separator {
  position: relative;

  hr.start {
    background: linear-gradient(to left, var(--q-dark), transparent);
  }

  hr.end {
    background: linear-gradient(to right, var(--q-dark), transparent);
  }

  .label {
    position: relative;
    font-size: 1rem;
    padding: 0 10px;
    margin: 0;
    opacity: 0.6;

    &.start {
      padding-left: 0;
    }

    &.end {
      padding-right: 0;
    }
  }
}
</style>
