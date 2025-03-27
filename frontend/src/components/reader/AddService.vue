<template>
  <section class="reader-add-service bg-accent">
    <header class="row col-12 justify-between items-center text-readable">
      <section class="col row items-center">
        <q-icon name="language" size="20px" />
        <span class="q-px-sm">
          Add Service
        </span>
      </section>

      <section class="col-auto">
        <q-btn icon="close" class="o-toolbar-btn" flat @click="emit('close')" />
      </section>
    </header>
    <q-scroll-area class="o-scroll-wrapper">
      <q-list>
        <q-item-label class="text-readable">
          推荐
        </q-item-label>
        <template v-for="(item, index) in services" :key="index">
          <q-item class="bg-secondary" clickable @click="onSelect(item)">
            <q-item-section avatar>
              <q-avatar>
                <q-icon :name="item.icon" size="40px" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-bold">
                {{item.label}}
              </q-item-label>
              <q-item-label caption>
                {{item.label}}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="radio_button_checked" size="14px" color="primary" />
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-scroll-area>
  </section>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';

const props = defineProps({
  name: {
    type: String,
    default: 'google'
  }
});
const emit = defineEmits(['close', 'select']);

const services = computed(() => {
  return [
    { label: 'Google', value: 'google', icon: 'public', type: 'service', url: 'https://www.google.com/search?q={word}' },
    { label: 'Google Dictionary', value: 'google_dictionary', icon: 'public', type: 'service', url: 'https://www.google.com/search?q=define:{word}' },
    { label: 'Bing', value: 'bing', icon: 'public', type: 'service', url: 'https://www.bing.com/search?q={word}' },
    { label: '汉典', value: 'zdic', icon: 'public', type: 'service', url: 'https://www.zdic.net/hans/{word}' },
    { label: '欧路词典', value: 'eudic', icon: 'public', type: 'service', url: 'https://dict.eudic.net/dicts/en/{word}' },
  ];
});

function onSelect(item :any) {
  emit('select', item);
}
</script>

<style lang="scss">
.reader-add-service {
  header {
  }

  .o-scroll-wrapper {
    .q-list {
      padding: 0 1rem;

      .q-item {
        padding: 8px;
        border-radius: 4px;

        &:not(:first-child) {
          margin-top: 1rem;
        }
      }
    }
  }
}
</style>
