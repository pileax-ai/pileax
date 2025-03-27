<template>
  <q-btn class="toggle-fullscreen-btn" :class="defaultClass"
         :icon="icon"
         @click="toggle" round flat>
    <q-tooltip class="bg-primary text-white">
      {{$t(tooltip)}}
    </q-tooltip>
  </q-btn>
</template>

<script>
export default {
  name: 'toggle-fullscreen-btn',
  props: {
    defaultClass: {
      type: String,
      default: 'text-white'
    },
  },
  methods: {
    toggle () {
      this.$q.fullscreen.toggle();
    }
  },
  computed: {
    icon () {
      return this.$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'
    },
    tooltip () {
      return this.$q.fullscreen.isActive ? 'fullscreen.exit' : 'fullscreen'
    }
  }
}
</script>

<style lang="scss">
.toggle-fullscreen-btn {
}
</style>
