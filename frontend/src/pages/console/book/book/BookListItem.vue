<template>
  <q-item class="book-list-item bg-accent" clickable>
    <q-item-section avatar>
      <q-img :src="coverPath" :ratio="3/4" spinner-size="20px" />
    </q-item-section>
    <q-item-section class="meta">
      <q-item-label class="title" lines="1">
        {{ data.title }}
      </q-item-label>
      <q-item-label caption>
        {{ data.author }}
      </q-item-label>
      <q-item-label caption>
        {{ data.publisher }}
      </q-item-label>
    </q-item-section>
    <q-item-section side>
      <div class="time">
        {{ timeMulti(data.updateTime).fromNow }}
      </div>
      <div class="row">
        <q-btn :label="$t('add')"
               class="bg-tips details"
               flat
               @click.stop="emit('add')"
               v-if="add" />
        <q-btn :label="$t('details')"
               class="bg-tips details q-ml-sm"
               flat
               @click.stop="emit('details')" />
      </div>
    </q-item-section>

    <slot></slot>
  </q-item>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue'
import { timeMulti } from 'core/utils/format'
import useApi from 'src/hooks/useApi'

const props = defineProps({
  data: {
    type: Object,
    default: function () {
      return {}
    }
  },
  add: {
    type: Boolean,
    default: false
  },
})
const emit = defineEmits(['add', 'details'])

const { getCoverUrl } = useApi()

const coverPath = computed(() => {
  return getCoverUrl(props.data)
})
</script>

<style lang="scss">
.book-list-item {
  position: relative;
  height: 120px;
  cursor: pointer;
  border-radius: 8px;
  max-width: 100%;

  &:not(:first-child) {
    margin-top: 8px;
  }

  &:hover {
    .details {
      visibility: visible;
    }
  }

  .q-item__section--avatar {
    min-width: 90px;
  }

  .meta {
    padding: 10px 0;
    justify-content: start;

    .title {
      font-size: 1.2rem;
      font-weight: 600;
      //max-width: 50%;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 1rem;
    }

    .q-item__label--caption {
      font-size: 1rem;
    }
  }

  .time {
    position: absolute;
    top: 16px;
    right: 16px;
    font-size: 0.9rem;
    font-weight: 400;
  }

  .details {
    visibility: hidden;
  }
}
</style>
