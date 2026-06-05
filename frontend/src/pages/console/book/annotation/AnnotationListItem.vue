<template>
  <q-item class="annotation-list-item"
          :class="{ 'annotation-only': annotationOnly }"
          clickable
          @click="emit('details', data, coverUrl)">
    <template v-if="annotationOnly">
      <q-item-section class="meta" :class="data.type">
        <q-item-label class="title" lines="1" caption>
          <section class="row justify-between text-readable">
            <div class="row col-6">
              <div class="row col-auto items-center q-pr-sm">
                <q-icon :name="getArrayItem(BookAnnotationTypes, data.type).icon"
                        :style="{ color: data.color ? getAnnotationColor(data.color) : '' }"
                        class="q-mr-sm"
                        size="1rem" />
                {{data.page}} /
                <o-tooltip position="left" transition>
                  {{ getArrayItem(BookAnnotationTypes, data.type).label }}
                </o-tooltip>
              </div>
              <div class="col ellipsis text-left">
                {{data.chapter}}
              </div>
            </div>
            <div class="row col-6 justify-end">
              <div>
                {{ timeMulti(data.updateTime).fromNow() }}
                <o-tooltip>
                  {{ timeMulti(data.updateTime).timestamp() }}
                </o-tooltip>
              </div>
            </div>
          </section>
        </q-item-label>
        <q-item-label lines="6" v-if="data.type !== 'bookmark'">
          <div class="content" v-if="data.type === 'annotation'">
            {{ data.title }}
          </div>
          <div v-else>
            <o-note-view :text="data.noteJson"></o-note-view>
          </div>
        </q-item-label>
      </q-item-section>
    </template>
    <template v-else>
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
              <div class="row col-auto items-center q-pl-sm">
                / {{data.page}}
                <q-icon :name="getArrayItem(BookAnnotationTypes, data.type).icon"
                        :style="{ color: data.color ? getAnnotationColor(data.color) : '' }"
                        class="q-ml-sm"
                        size="1rem" />
              </div>
            </div>
          </section>
        </q-item-label>
        <q-item-label lines="6">
          <div class="content" v-if="data.type === 'annotation'">
            {{ data.title }}
          </div>
          <div v-else>
            <o-note-view :text="data.noteJson"></o-note-view>
          </div>
        </q-item-label>
        <q-item-label caption>
          <div class="row q-pt-md relative-position">
            <div>
              {{ timeMulti(data.updateTime).fromNow() }}
              <o-tooltip>
                {{ timeMulti(data.updateTime).timestamp() }}
              </o-tooltip>
            </div>
          </div>
        </q-item-label>
      </q-item-section>
    </template>
  </q-item>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue'

import ONoteView from 'components/form/ONoteView.vue'

import { timeMulti } from 'core/utils/dayjs'
import useApi from 'src/hooks/useApi'
import useMetadata from 'src/hooks/useMetadata'
import { getAnnotationColor } from 'src/utils/book'

const props = defineProps({
  data: {
    type: Object,
    default: function () {
      return {}
    }
  },
  annotationOnly: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['details'])

const { getCoverUrl } = useApi()
const { BookAnnotationTypes, getArrayItem } = useMetadata()
const coverUrl = ref('')
const coverPath = computed(() => {
  return `${props.data.path}/${props.data.coverName}`
})

function getCover() {
  coverUrl.value = getCoverUrl(props.data)
}

watch(() => coverPath.value, (newValue) => {
  getCover()
})

onMounted(() => {
  getCover()
})

</script>

<style lang="scss">
.annotation-list-item {
  position: relative;
  cursor: pointer;
  border-radius: 8px;
  max-width: 100%;
  background: var(--q-accent);

  &.annotation-only {
    &:not(:first-child) {
      margin: 0 !important;
      border-top: solid 1px var(--q-dark);
    }

    border-radius: 0;
  }

  &:not(:first-child) {
    margin-top: 8px;
  }

  .q-item__section--avatar {
    min-width: 90px;
  }

  .meta {
    padding: 10px 0;
    justify-content: start;

    &.bookmark {
      .title {
        margin: 0;
      }
    }

    .title {
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 1rem;
    }

    .content {
      line-height: 1.6;
    }

    .q-item__label--caption {
      font-size: 1rem;
    }
  }

  .o-note-view {
    max-height: 100px;
    h1, h2 {
      font-size: 120%;
    }

    .tiptap {
      font-size: 90% !important;
    }
  }
}
</style>
