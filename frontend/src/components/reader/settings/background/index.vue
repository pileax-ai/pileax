<template>
  <setting-tab title="背景" @close="emit('close')">
    <q-list>
      <q-item-label class="text-readable">
        背景
      </q-item-label>
      <template v-for="(item, index) in list" :key="index">
        <q-item class="bg-accent" clickable
                @click="onValueChanged('backgroundImage', item.url)">
          <q-item-section avatar>
            <q-avatar rounded>
              <q-img :src="item.url.indexOf('http') === 0 ? item.url : $public(item.url)" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-bold">
              {{item.label}}
            </q-item-label>
            <q-item-label caption>
              {{item.type}}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <div class="row">
              <q-btn icon="radio_button_checked" color="primary" size="12px"
                     flat round
                     v-if="item.url === backgroundImage" />
            </div>
          </q-item-section>
        </q-item>
      </template>

    </q-list>

    <q-separator class="bg-accent" />
    <q-list>
      <q-item-label class="text-readable">
        背景模糊
      </q-item-label>
      <o-field-label content-class="col-8">
        <q-slider v-model="backgroundBlur"
                  :min="0" :max="200" :step="1"
                  :label-value="`${backgroundBlur}`"
                  label
                  label-always
                  track-size="5px"
                  @update:modelValue="onValueChanged('backgroundBlur', $event)" />
      </o-field-label>
    </q-list>
  </setting-tab>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from 'vue'
import SettingTab from 'components/reader/settings/setting-tab.vue';
import useReaderSetting from 'src/hooks/useReaderSetting';
import OFieldLabel from 'core/components/form/field/OFieldLabel.vue'

const emit = defineEmits(['close']);

const { settings, setSettingItem } = useReaderSetting();
const backgroundBlur = ref(0);

const list = computed(() => {
  return [
    {
      label: "None",
      value: "google",
      icon: "icon-google-color",
      type: "service",
      url: "",
    },
    {
      label: "The Bubble Nebula",
      value: "dark-01",
      icon: "icon-google-color",
      type: "dark",
      url: "/images/book/dark-01.jpg",
    },
    {
      label: "Pillars of Creation",
      value: "dark-01",
      icon: "icon-google-color",
      type: "dark",
      url: "/images/book/dark-02.jpg",
    },
    {
      label: "杨柳岸",
      value: "light-01",
      icon: "icon-google-color",
      type: "light",
      url: "/images/book/light-01.jpg",
    },
    {
      label: "古书",
      value: "light-01",
      icon: "icon-google-color",
      type: "light",
      url: "/images/book/img_1.png",
    },
  ];
});

const backgroundImage = computed(() => settings.value.backgroundImage);

function onValueChanged(key: string, value: any) {
  setSettingItem(key, value);
}

onBeforeMount(() => {
  backgroundBlur.value = settings.value.backgroundBlur || 0;
})
</script>

<style lang="scss">

</style>
