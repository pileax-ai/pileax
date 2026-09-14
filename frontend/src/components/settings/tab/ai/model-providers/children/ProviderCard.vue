<template>
  <q-card class="ai-provider-card bg-accent" flat>
    <q-card-section class="header">
      <q-item>
        <q-item-section avatar>
          <q-avatar size="3rem" square>
            <o-svg-icon :name="data.logo" size="3rem" colored />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label class="name">
            {{data.alias}}
          </q-item-label>
          <q-item-label class="vendor text-tips">
            {{data.vendor}}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <div class="row">
            <q-btn icon="add" :label="$t('add')" class="bg-primary text-white add"
                   @click="emit('add')" flat />
          </div>
        </q-item-section>
      </q-item>
    </q-card-section>

    <q-card-section class="content">
      <q-item-label>
        <template v-for="(item, index) in data.tags.split(',')" :key="index">
          <q-chip size="10px" dense square>{{item}}</q-chip>
        </template>
      </q-item-label>
    </q-card-section>

    <div class="row justify-center actions" v-if="false">
      <section class="text-tips">
        <q-btn icon="add" :label="$t('add')" class="bg-primary text-white"
               flat @click="emit('add')" />
      </section>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

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
const emit = defineEmits(['add'])
</script>

<style lang="scss">
.ai-provider-card {
  position: relative;
  overflow: hidden;

  &:hover {
    .actions {
      visibility: visible;
      opacity: 1;
      transform: translateY(0);
    }

    .header .add {
      visibility: visible;
      opacity: 1;
    }
  }

  .header {
    padding: 10px 0 0 0;

    .q-item__section--main {
      padding-left: 8px;
    }
    .q-item__section--side {
      min-width: 36px;
      padding-right: 0;
    }

    .add {
      padding: 4px 12px;
      min-height: unset;
      visibility: hidden;
      opacity: 0;
      transition: opacity 0.5s ease-in-out;
    }

    .name {
      font-size: 1.2rem;
      font-weight: 600;
    }

    .vendor {
      font-size: 0.6rem;
    }
  }

  .content {
    min-height: 80px;
  }

  .actions {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 8px 0;
    background: rgba(0, 0, 0, 0.2);
    //background: var(--q-dark);
    visibility: hidden;
    opacity: 0;
    transform: translateY(100%);
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out, visibility 0.3s;
  }

}
</style>
