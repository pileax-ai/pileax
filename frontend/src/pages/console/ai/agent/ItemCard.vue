<template>
  <q-card class="ai-assistant-card bg-accent" flat>
    <q-responsive :ratio="16/9">
      <q-img :src="getFileUrl(data.path)" spinner-size="1rem" />
    </q-responsive>
    <q-separator class="bg-dark" />

    <q-card-actions class="row justify-between">
      <section class="text-tips ellipsis">
        {{data.originalName}}
      </section>
      <section class="text-tips">
        <q-btn label="详情" color="blue" flat @click="emit('edit')" />
      </section>
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import useApi from 'src/hooks/useApi'

const props = defineProps({
  data: {
    type: Object,
    default: function () {
      return {}
    }
  },
  showTag: {
    type: Boolean,
    default: false
  }
})
const { getFileUrl } = useApi()
const emit = defineEmits(['edit', 'disable'])
const fetching = ref(false)
</script>

<style lang="scss">
.ai-assistant-card {

  .header {
    padding: 10px 0 0 0;

    .q-item__section--side {
      min-width: 36px;
      padding-right: 0;
    }
  }

}
</style>
