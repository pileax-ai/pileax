<template>
  <section class="reader-add-service bg-secondary main">
    <o-tool-bar />
    <header class="row col-12 justify-between items-center text-readable">
      <section class="col row items-center">
        <q-icon name="language" size="20px" />
        <span class="q-px-sm">
          Manage Services
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
          <q-item class="bg-accent" clickable>
            <q-item-section avatar>
              <q-avatar rounded>
                <o-icon :name="item.icon" size="40px" />
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
              <q-btn icon="close" color="red" size="12px" flat round
                     @click.stop="onRemove(item)"
                     v-if="isEnabled(item)" />
              <q-btn icon="add" color="primary" size="12px" flat round
                     @click.stop="onAdd(item)"
                     v-else />
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-scroll-area>
  </section>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import useReader from 'src/hooks/useReader'
import OToolBar from 'core/components/electron/OToolBar.vue'

const props = defineProps({
  main: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['close', 'add', 'remove']);

const {
  mainService,
  secondaryService,
} = useReader();

const enabledServices = computed(() => {
  return props.main ? mainService.value : secondaryService.value;
});

const services = computed(() => {
  return [
    {
      label: "Google",
      value: "google",
      icon: "icon-google-color",
      type: "service",
      url: "https://www.google.com/search?q={word}",
    },
    {
      label: "Google Dictionary",
      value: "google_dictionary",
      icon: "icon-google-color",
      type: "service",
      url: "https://www.google.com/search?q=define:{word}",
    },
    {
      label: "Bing",
      value: "bing",
      icon: "icon-bing-color",
      type: "service",
      url: "https://www.bing.com/search?q={word}",
    },
    {
      label: "汉典",
      value: "zdic",
      icon: "png-zdict",
      type: "service",
      url: "https://www.zdic.net/hans/{word}",
    },
    {
      label: "欧路词典",
      value: "eudic",
      icon: "png-eudic",
      type: "service",
      url: "https://dict.eudic.net/dicts/en/{word}",
    },
  ];;
});

function isEnabled(item: Indexable) {
  return enabledServices.value.find(s => s.value === item.value);
}

function onAdd(item :any) {
  emit('add', item);
}

function onRemove(item :any) {
  const idx = enabledServices.value.findIndex(s => s.value === item.value);
  if (idx >= 0) {
    props.main
      ? mainService.value.splice(idx, 1)
      : secondaryService.value.splice(idx, 1);
    emit('remove');
  }
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
