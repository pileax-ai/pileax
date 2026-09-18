<template>
  <q-responsive :ratio="2/1">
    <q-card class="group-compact-item">
      <q-img class="group-item-container">
        <div class="fit group-item">
          <div class="group-book-grid">
            <template v-for="(item, index) in data.books.slice(0, 4)" :key="index">
              <div class="group-book-item">
                <q-img :src="getCoverUrl(item)" spinner-size="1.4rem" class="book-cover" />
              </div>
            </template>
          </div>
          <div class="row items-center title">
            {{ data.collection.title }}
          </div>
        </div>

        <div class="absolute-bottom text-subtitle1 text-center details">
          <q-btn flat>
            <div class="row col-12 justify-between">
              <div>
                {{ data.collection.title }}
              </div>
              <div>
                {{ data.count }}
              </div>
            </div>
          </q-btn>
        </div>
      </q-img>
    </q-card>
    <slot></slot>
  </q-responsive>
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
.group-compact-item {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;

  .group-item-container {
    height: 100%;

    .group-item {
      color: unset;
      background: transparent;
      padding: 0;

      .title {
        height: 30px;
        padding: 0 8px 8px 8px;
        font-weight: 600;
      }

      .group-book-grid {
        width: 100%;
        height: calc(100% - 30px);
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(1, 1fr);
        gap: 8px;
        padding: 8px 8px;
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

  .details {
    color: #ffffff;
    background: rgba(0,0,0,0.5);
    padding: 0;
    visibility: hidden;
    opacity: 0;
    transform: translateY(100%);
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out, visibility 0.3s;

    .q-btn {
      height: 48px;
      width: 100%;
    }
  }

  &:hover {
    .details {
      visibility: visible;
      opacity: 1;
      transform: translateY(0);
    }
  }
}
</style>
