<template>
  <q-card class="ai-provider-card bg-accent" flat>
    <q-card-section class="header">
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <o-svg-icon :name="data.name" size="2.4rem" />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-bold">
            {{data.title}}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <section class="row text-tips">
            <o-link :link="data.github">
              <o-svg-icon name="github" size="1.6rem" />
            </o-link>
          </section>
        </q-item-section>
      </q-item>
    </q-card-section>

    <q-card-section>
      <q-item-label lines="1">
        {{data.description}}
      </q-item-label>
    </q-card-section>
    <q-separator class="bg-dark" />

    <q-card-actions class="row justify-between">
      <section>
        <o-badge color="green" icon="check" v-if="data.enabled">已启用</o-badge>
        <o-badge color="amber" icon="blur_on" v-else>未启用</o-badge>
      </section>
      <section class="text-tips">
        <q-btn label="禁用" color="red" flat @click="emit('disable')" v-if="data.enabled" />
        <q-btn label="启用" color="primary" flat @click="emit('edit')" v-else />
        <q-btn label="配置" color="primary" flat @click="emit('edit')" v-if="data.enabled" />
      </section>
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

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
const emit = defineEmits(['edit', 'disable']);
const fetching = ref(false);
</script>

<style lang="scss">
.ai-provider-card {

  .header {
    padding: 10px 0 0 0;

    .q-item__section--side {
      min-width: 36px;
      padding-right: 0;
    }
  }

}
</style>
