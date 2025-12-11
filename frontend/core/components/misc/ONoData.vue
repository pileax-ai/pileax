<template>
  <div class="o-no-data">
    <img :src="$public('/images/ui/page/no-data.svg')" v-if="image" />
    <div class="q-pt-lg text-tips" v-if="message">{{ message }}</div>

    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  image: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: 'No records'
  },
})
</script>

<style lang="scss">
.o-no-data {
  text-align: center;
  img {
    width: 50%;
    min-width: 200px;
    max-width: 300px;
  }
}
</style>
