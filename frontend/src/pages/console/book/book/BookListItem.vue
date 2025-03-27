<template>
  <q-item class="book-list-item bg-accent" clickable>
    <q-item-section avatar>
      <q-img :src="coverUrl" :ratio="3/4" spinner-size="20px" />
    </q-item-section>
    <q-item-section class="meta">
      <q-item-label class="title" lines="1">
        {{data.title}}
      </q-item-label>
      <q-item-label caption>
        王大力
      </q-item-label>
      <q-item-label caption>
        {{data.publisher}}
      </q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-btn label="详情" flat @click.stop="emit('details')" />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import {computed, onActivated, onBeforeMount, onMounted, ref, watch} from 'vue';

const props = defineProps({
  data: {
    type: Object,
    default: function () {
      return {};
    }
  },
});
const emit = defineEmits(['details']);

const coverUrl = ref('');

const coverPath = computed(() => {
  return `${props.data.path}/${props.data.coverName}`;
})

function getCover() {
  window.electronAPI.readBookCover(coverPath.value).then((res: any) => {
    coverUrl.value = res.url;
  }).catch((err: any) => {
    console.error('打开文件失败：', err);
  })
}

watch(() => coverPath.value, (newValue) => {
  getCover();
})

onMounted(() => {
  getCover();
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

  .q-item__section--avatar {
    min-width: 90px;
  }

  .meta {
    padding: 10px 0;
    justify-content: start;

    .title {
      font-size: 1.2rem;
      font-weight: 600;
      max-width: 50%;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 1rem;
    }

    .q-item__label--caption {
      font-size: 1rem;
    }
  }
}
</style>
