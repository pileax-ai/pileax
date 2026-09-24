<template>
  <q-item class="group-list-item bg-accent" clickable>
    <q-item-section avatar>
      <q-img class="group-item-container">
        <div class="fit group-item">
          <div class="group-book-grid">
            <template v-for="(item, index) in data.books.slice(0, 4)" :key="index">
              <div class="group-book-item">
                <q-img :src="getCoverUrl(item)" spinner-size="1.4rem" class="book-cover" />
              </div>
            </template>
          </div>
        </div>
      </q-img>
    </q-item-section>
    <q-item-section class="meta">
      <q-item-label class="title" lines="1">
        {{ data.collection.title }}
      </q-item-label>
      <q-item-label lines="1" caption>
        {{ $t('book.total', {total: data.count}) }}
      </q-item-label>
    </q-item-section>
    <q-item-section class="justify-around" side>
      <div class="details">
        <q-btn :label="$t('open')"
               :to="`/book/group/${data.id}`"
               class="bg-primary text-white q-ml-sm"
               flat />
      </div>
    </q-item-section>

    <slot></slot>
  </q-item>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import useApi from 'src/hooks/useApi'

const props = defineProps({
  data: {
    type: Object,
    default: function () {
      return {}
    }
  },
})
const emit = defineEmits(['add', 'details'])

const { getCoverUrl } = useApi()
const coverUrl = ref('')

onMounted(() => {
  coverUrl.value = getCoverUrl(props.data)
})
</script>

<style lang="scss">
.group-list-item {
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

  .group-item-container {
    height: 100%;
    width: 320px;

    .group-item {
      color: unset;
      background: transparent;
      padding: 0;

      .group-book-grid {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(1, 1fr);
        gap: 8px;
        padding: 0;
        box-sizing: border-box;
        overflow: hidden;
      }

      .group-book-item {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }

      .book-cover {
        width: 100%;
        height: 100%;
        border-radius: 2px;
      }
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
