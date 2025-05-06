<template>
  <section class="font-settings">
    <o-view-item label="字体" value="黑体" class="col-12"
                 align="right" arrow clickable
                 @click="emit('next', 'font')" />
    <o-field-label label="字体大小" content-class="col-8" side>
      <q-slider v-model="fontSize"
                :min="1" :max="2" :step="0.1"
                :label-value="`${fontSize}`"
                label
                label-always
                track-size="5px"
                @update:modelValue="onValueChanged('fontSize', $event)" />
    </o-field-label>
  </section>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';

import useReaderSetting from 'src/hooks/useReaderSetting';
const { settings, setSettingItem } = useReaderSetting();
import OFieldLabel from 'core/components/form/field/OFieldLabel.vue';

const emit = defineEmits(['next']);

const fontSize = ref(1.2);

function onValueChanged(key: string, value: any) {
  setSettingItem(key, value);
}

onBeforeMount(() => {
  fontSize.value = settings.value.fontSize || 1.2;
})
</script>

<style lang="scss">
.font-settings {
}
</style>
