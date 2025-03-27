<template>
  <div class="page-transition-dropdown">
    <q-btn-dropdown no-caps unelevated rounded
                    toggle-color="primary"
                    color="accent"
                    text-color="tips"
                    :class="itemClass"
                    :label="getArrayItem(PAGE_TRANSITIONS, pageTransition.name).label">
      <q-list>
        <q-item v-for="(item, index) in PAGE_TRANSITIONS" :key="index"
                clickable
                v-close-popup @click="setPageTransition('name', item.value)">
          <q-item-section>
            <q-item-label>{{ item.label }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="done" size="1rem" v-if="item.value === pageTransition.name" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>

<script setup lang="ts">
import {onBeforeMount, ref} from 'vue';
import { getArrayItem } from 'core/hooks/useCommon';
import useSetting from 'core/hooks/useSetting';
import { PAGE_TRANSITIONS } from 'core/constants/setting';

defineProps({
  itemClass: {
    type: String,
    default: ''
  }
});

const { pageTransition, setPageTransition} = useSetting();

const value = ref('');

onBeforeMount(() => {
  value.value = pageTransition.value.name;
})
</script>

<style lang="scss">
.page-transition-dropdown {
}
</style>
