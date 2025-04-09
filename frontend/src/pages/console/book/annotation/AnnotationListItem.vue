<template>
  <q-item class="annotation-list-item bg-accent" clickable @click="emit('details', data, coverUrl)">
    <q-item-section avatar>
      <q-img :src="coverUrl" :ratio="3/4" spinner-size="20px" />
    </q-item-section>
    <q-item-section class="meta">
      <q-item-label class="title" lines="1" caption>
        <section class="row justify-between text-readable">
          <div class="col-6  ellipsis">
            {{data.bookTitle}}
          </div>
          <div class="row col-6">
            <div class="col ellipsis text-right">
              {{data.chapter}}
            </div>
            <div class="col-auto q-pl-sm">
              / {{data.page}}
            </div>
          </div>
        </section>
      </q-item-label>
      <q-item-label lines="6">
        {{data.note}}
      </q-item-label>
      <q-item-label caption>
        <div class="row q-pt-md relative-position">
          <div>
            {{ timeMulti(data.updateTime).fromNow }}
            <o-tooltip>
              {{ timeMulti(data.updateTime).timestamp }}
            </o-tooltip>
          </div>
        </div>
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue';
import { timeMulti } from 'core/utils/format';
import useApi from 'src/hooks/useApi';

const props = defineProps({
  data: {
    type: Object,
    default: function () {
      return {};
    }
  },
});
const emit = defineEmits(['details']);

const { getCoverUrl } = useApi();
const coverUrl = ref('');
const coverPath = computed(() => {
  return `${props.data.path}/${props.data.coverName}`;
})

function getCover() {
  // window.electronAPI.readBookCover(coverPath.value).then((res: any) => {
  //   coverUrl.value = res.url;
  // }).catch((err: any) => {
  //   console.error('打开文件失败：', err);
  // })
  coverUrl.value = getCoverUrl(props.data);
}

watch(() => coverPath.value, (newValue) => {
  getCover();
})

onMounted(() => {
  getCover();
})

</script>

<style lang="scss">
.annotation-list-item {
  position: relative;
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
