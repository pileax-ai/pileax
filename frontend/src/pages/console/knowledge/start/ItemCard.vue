<template>
  <q-card class="knowledge-card bg-accent" flat>
    <q-card-section class="header">
      <q-item>
        <q-item-section avatar>
          <q-img :src="$public('/logo.png')" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-bold title">
            {{data.name}}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="查看" color="primary"
                 :to="`/knowledge/${data.id}`"
                 flat />
        </q-item-section>
      </q-item>
    </q-card-section>
    <q-card-section class="description">
      <q-item-label lines="3">
        {{data.description}}
      </q-item-label>
    </q-card-section>
    <q-separator class="bg-dark" />

    <q-card-actions class="row justify-between">
      <section class="text-tips ellipsis">
        {{data.updateTime}}
      </section>
      <section class="text-tips">
        <q-btn icon="settings" size="0.8rem" flat round @click="emit('edit')" />
      </section>
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
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
});
const { getFileUrl } = useApi();
const emit = defineEmits(['edit']);
const fetching = ref(false);
</script>

<style lang="scss">
.knowledge-card {
  .header {
    padding: 0;

    .q-item {
      padding: 8px;
      .q-item__section--side {
        padding-right: 8px;
      }

      .title {
        font-size: 1.2rem;
      }
    }
  }

  .description {
    height: 85px;
  }
}
</style>
