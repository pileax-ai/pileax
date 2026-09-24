<template>
  <q-responsive :ratio="3/4.5">
    <q-card class="group-grid-title-item" flat v-ripple>
      <q-img class="bg-dark group-item-container">
        <div class="fit group-item">
          <div class="group-book-grid">
            <template v-for="(item, index) in data.books.slice(0, 4)" :key="index">
              <div class="group-book-item">
                <q-img :src="getCoverUrl(item)" spinner-size="1.4rem" class="book-cover" />
              </div>
            </template>
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

      <footer class="row items-center title ellipsis">
        {{data.collection.title}}
      </footer>
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
.group-grid-title-item {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
  border-radius: 0;

  .group-item-container {
    height: calc(100% - 32px);

    .group-item {
      color: unset;
      background: transparent;
      padding: 0;

      .group-book-grid {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(2, 1fr);
        gap: 12px;
        padding: 12px;
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
      }
    }
  }

  .details {
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

  .title {
    height: 32px;
    line-height: 38px;
    font-weight: 600;
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
