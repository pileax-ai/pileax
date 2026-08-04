<template>
  <q-item class="book-item bg-accent" clickable @click="openBook(data)">
    <q-item-section avatar>
      <q-img :src="coverUrl" :ratio="3/4" spinner-size="20px" @error="onError" />
    </q-item-section>
    <q-item-section class="meta">
      <q-item-label class="title" lines="1">
        {{ data.title }}
      </q-item-label>
      <q-item-label lines="1" caption>
        {{ data.author }}
      </q-item-label>
      <q-item-label caption>
        {{ data.publisher }}
        <span v-if="data.published">
          / {{ data.published.substring(0, 4) }}
        </span>
      </q-item-label>
    </q-item-section>
    <q-item-section class="justify-around" side>

    </q-item-section>

    <slot></slot>
  </q-item>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue'
import useApi from 'src/hooks/useApi'
import useReading from 'src/hooks/useReading'

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
const { openBook } = useReading()
const coverUrl = ref('')

function onError(event: any) {
  coverUrl.value = '/images/ui/page/page-bg.svg'
}

onMounted(() => {
  coverUrl.value = getCoverUrl(props.data)
})
</script>

<style lang="scss">
.book-item {
  position: relative;
  height: 120px;
  cursor: pointer;
  border-radius: 8px;
  max-width: 100%;

  .bookmark {
    position: absolute;
    top: -10px;
    right: 8px;
    z-index: 1;
  }

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
    //position: absolute;
    //top: 16px;
    //right: 16px;
    font-size: 0.9rem;
    font-weight: 400;
  }

  .details {
    visibility: hidden;
  }

  .tags {
    .q-chip {
      background: rgba(0,0,0,0.1);
      color: #ffffff;
      font-size: 0.8rem;
    }
  }
}
</style>
