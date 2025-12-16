<template>
  <section class="annotation-details">
    <q-card class="cover-card" flat>
      <div class="cover">
        <img :src="coverUrl" />
      </div>
      <div class="absolute-right more">
        <q-btn icon="more_horiz" flat >
          <q-menu class="pi-menu">
            <q-list>
              <template v-for="(action, index) in actions" :key="`action-${index}`">
                <template v-if="true">
                  <q-separator class="bg-accent" v-if="action.separator" />
                  <o-common-item v-bind="action"
                                 class="text-tips"
                                 @click="onAction(action)"
                                 clickable
                                 closable
                                 right-side>
                  </o-common-item>
                </template>
              </template>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </q-card>

    <q-card flat>
      <q-card-section class="meta">
        <header class="title text-readable">{{data.bookTitle}}</header>
        <o-view-item :label="$t('book.chapter')"
                     :value="data.chapter" align="right" lines="2" />
        <o-view-item :label="$t('time')"
                     :value="timeMulti(data.createTime).timestamp" align="right" />
        <o-view-item :label="$t('book.annotation')"
                     :value="data.note" class="q-mt-md annotation" align="right" copiable />

        <section class="note">
          <q-scroll-area>
            <div v-html="data.note"></div>
          </q-scroll-area>
        </section>
      </q-card-section>

      <q-card-section class="row col-12 justify-center">
        <q-btn icon="visibility"
               :label="$t('book.startPreview')"
               class="bg-cyan text-white action"
               flat
               @click="openBook" />
        <div class="col-12 text-center text-tips caption q-mt-md">
          {{ $t('book.previewTips') }}
        </div>
      </q-card-section>
    </q-card>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { timeMulti } from 'core/utils/format'
import { ipcService } from 'src/api/ipc'
import useCrud from 'src/hooks/useCrud'
import useCommon from 'core/hooks/useCommon'

const props = defineProps({
  data: {
    type: Object,
    default: function () {
      return {}
    }
  },
  coverUrl: {
    type: String,
    default: ''
  },
})
const emit = defineEmits(['close'])

const { t } = useCommon()
const { crud } = useCrud()

const actions = computed(() => {
  return [
    {
      label: t('remove'),
      value: 'remove',
      icon: 'delete',
    },
  ]
})


function onAction (action :any) {
  switch (action.value) {
    case 'remove':
      onRemove()
      break
    case 'title':
      break
    default:
      break
  }
}

function onRemove() {
  crud.remove(props.data.id, {
    callback: (_) => {
      emit('close', {
        action: 'remove',
        item: props.data
      })
    }
  })
}


function openBook() {
  const item = props.data
  ipcService.openNewWindow(item.id, `/reader/annotation?id=${item.id}`)
}

onMounted(() => {
  crud.init('bookAnnotation')
})
</script>

<style lang="scss">
.annotation-details {
  width: 100%;
  height: 100%;

  .more {
    padding: 4px;
    .q-btn {
      width: 36px;
      height: 36px;
    }
  }

  .cover-card {
    height: 200px;
  }

  .cover {
    width: 100%;
    height: 100%;
    text-align: center;
    padding-top: 1rem;

    img {
      height: 100%;
      border-radius: 4px;
    }
  }

  .meta {
    .title {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 10px;
    }
    .o-view-item {
      min-height: unset;
      padding: 4px 0;

      &.annotation {
        .value {
          display: none;
        }
      }
    }

    .note {
      margin-top: 0;
      font-size: 1.1rem;
      text-align: justify;
      .q-scrollarea {
        height: 240px;
      }
    }
  }

  .action {
    padding: 12px 40px;
  }
}
</style>
