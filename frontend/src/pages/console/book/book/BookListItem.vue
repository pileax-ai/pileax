<template>
  <q-item class="book-list-item bg-accent" clickable>
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
      <div class="time">
        {{ timeMulti(data.updateTime).fromNow() }}
      </div>
      <div class="details">
        <q-btn :label="$t('add')"
               class="bg-primary text-white"
               flat
               @click.stop="emit('add')"
               v-if="add && !data.workspaceBookId" />
        <q-btn :label="$t('details')"
               class="bg-primary text-white q-ml-sm"
               flat
               @click.stop="emit('details')" />
      </div>
      <div class="tags details">
        <template v-for="(item, index) in tags" :key="index">
          <q-chip v-bind="item" square dense />
        </template>
      </div>
    </q-item-section>
    <div class="bookmark" v-if="data.workspaceBookId">
      <q-icon name="o_bookmark" color="amber" size="16px" />
    </div>

    <slot></slot>
  </q-item>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue'
import { timeMulti } from 'core/utils/dayjs'
import useApi from 'src/hooks/useApi'
import useBookDetails from 'src/hooks/useBookDetails'

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

const { bookTags } = useBookDetails()
const { getCoverUrl } = useApi()
const coverUrl = ref('')

const tags = computed(() => {
  return bookTags(props.data)
})

function onError(event: any) {
  coverUrl.value = '/images/ui/page/page-bg.svg'
}

onMounted(() => {
  coverUrl.value = getCoverUrl(props.data)
})
</script>

<style lang="scss">
.book-list-item {
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
