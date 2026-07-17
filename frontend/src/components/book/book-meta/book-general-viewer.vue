<template>
  <o-simple-form class="book-general-viewer"
                 :loading="loading"
                 :action-label="$t('edit')"
                 @reset="actions.reset">
    <div class="row col-12 q-col-gutter-md">
      <div class="col-auto">
        <o-file-uploader :preview="getFileUrl(form.coverUrl)"
                         readonly />
      </div>
      <div class="row col justify-between">
        <section class="col-12">
          <div class="book-title">
            {{ form.title }}
          </div>
          <div class="subtitle text-readable" v-if="form.subtitle">
            {{ form.subtitle }}
          </div>
          <div class="book-author">
            {{ form.author }}
          </div>
        </section>
        <footer class="row col-12 items-end meta-actions">
          <q-btn icon="mdi-square-edit-outline" color="primary" flat round
                 @click="emit('edit')"
                 v-if="form.userId===form.owner">
            <o-tooltip position="bottom" transition>{{ $t('edit') }}</o-tooltip>
          </q-btn>
          <q-btn color="teal" flat round
                 @click="downloadBook(form)">
            <o-icon name="icon-download" size="2rem" />
            <o-tooltip position="bottom" transition>{{ $t('download') }}</o-tooltip>
          </q-btn>
        </footer>
      </div>
    </div>

    <!-- Basic Info -->
    <o-field-separator :label="$t('book.basicInfo')"
                       class="q-py-md" />
    <div class="row col-12 pi-view-grid">
      <div>
        <o-field :label="$t('book.publisher')">
          <o-view-item :value="form.publisher"
                       class="text-readable" copiable />
        </o-field>
      </div>
      <div>
        <o-field :label="$t('book.published')">
          <o-view-item :value="timeMulti(form.published, 'YYYY').timestamp()"
                       class="text-readable" copiable />
        </o-field>
      </div>
      <div>
        <o-field label="ISBN">
          <o-view-item :value="form.isbn" placeholder="9780xxxxxxxxx"
                       class="text-readable" copiable />
        </o-field>
      </div>
      <div>
        <o-field :label="$t('book.format')">
          <o-view-item :value="form.extension?.toUpperCase()" placeholder="NA"
                       class="text-readable" copiable />
        </o-field>
      </div>
      <div>
        <o-field :label="$t('fileSize')">
          <o-view-item :value="size" placeholder="NA"
                       class="text-readable" copiable />
        </o-field>
      </div>
      <div>
        <o-field :label="$t('language')">
          <o-view-item :value="form.language" placeholder="zh,en"
                       class="text-readable" copiable />
        </o-field>
      </div>
      <div>
        <o-field :label="$t('book.addTime')">
          <o-view-item :value="timeMulti(form.createTime, 'YYYY-MM-DD HH:mm').timestamp()"
                       class="text-readable" copiable />
        </o-field>
      </div>
      <div>
        <o-field :label="$t('updateTime')">
          <o-view-item :value="timeMulti(form.updateTime, 'YYYY-MM-DD HH:mm').timestamp()"
                       class="text-readable" copiable />
        </o-field>
      </div>
      <div>
        <o-field :label="$t('book.link')">
          <o-view-item :value="form.refUrl" :link="form.refUrl"
                       class="text-readable" copiable />
        </o-field>
      </div>
    </div>

    <o-field :label="$t('description')">
      <q-input v-model="form.description" placeholder="NA"
               type="textarea"
               class="pi-field max-height"
               maxlength="2048" counter
               standout dense clearable readonly v-if="false" />

      <o-book-desc :desc="form.description" />
    </o-field>

    <!-- Category -->
    <o-field-separator :label="$t('book.categoryInfo')"
                       class="q-pb-md" />
    <div class="row col-12 pi-view-grid">
      <div>
        <o-field label="CLC">
          <template #label>
            <q-icon name="mdi-help-circle-outline" class="q-ml-xs text-tips">
              <q-tooltip>Chinese Library Classification</q-tooltip>
            </q-icon>
          </template>
          <o-view-item :value="form.clcCode" placeholder="NA"
                       class="text-readable" copiable />
        </o-field>
      </div>
      <div>
        <o-field label="DDC">
          <template #label>
            <q-icon name="mdi-help-circle-outline" class="q-ml-xs text-tips">
              <q-tooltip>Dewey Decimal Classification</q-tooltip>
            </q-icon>
          </template>
          <o-view-item :value="form.ddcCode" placeholder="NA"
                       class="text-readable" copiable />
        </o-field>
      </div>
      <div>
        <o-field :label="$t('book.rating')">
          <o-view-item :value="form.rating" placeholder="NA"
                       class="text-readable" copiable />
        </o-field>
      </div>
    </div>
  </o-simple-form>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

import OSimpleForm from 'core/page/section/OSimpleForm.vue'
import OFileUploader from 'core/components/fIle/OFileUploader.vue'
import OFieldSeparator from 'core/components/form/field/OFieldSeparator.vue'
import OBookDesc from 'components/book/OBookDesc.vue'

import { GET } from 'src/hooks/useRequest'
import useApi from 'src/hooks/useApi'
import useForm from 'src/hooks/useForm'
import useBookDetails from 'src/hooks/useBookDetails'
import useReading from 'src/hooks/useReading'
import { timeMulti } from 'core/utils/dayjs'

const apiName = 'book'
const props = defineProps({
  bookId: {
    type: String,
    default: ''
  },
})
const emit = defineEmits(['edit'])

const { getFileUrl } = useApi()
const { form, loading, actions } = useForm()
const { downloadBook } = useBookDetails()
const { bookSize } = useReading()

const size = computed(() => {
  return bookSize(form.value)
})

function load () {
  actions.initForm(apiName)

  if (props.bookId) {
    GET({name: apiName, path: '/details', query: {id: props.bookId}}).then(res => {
      form.value = res as Indexable
    })
  }
}

onMounted(load)
</script>

<style lang="scss">
.book-general-viewer {
  .book-title {
    font-size: 1.4rem;
    font-weight: 600;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    word-break: break-all;
  }

  .book-author {
    margin-top: 1rem;
  }

  .meta-actions {
    margin: 0 0 -10px -10px;
    gap: 4px;
  }

  .o-view-item {
    min-height: 32px;
    &:hover {
      .q-btn {
        visibility: visible;
      }
    }

    .q-btn {
      visibility: hidden;
      min-width: 32px;
      min-height: 32px;
    }
  }

  .pi-view-grid {
    gap: 12px;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }

  .pi-field {
    &.q-field--standout.q-field--readonly .q-field__control:before {
      border: unset;
      background: transparent;
    }

    &.q-field--readonly {
      opacity: 0.7;
    }

    .q-icon {
      font-size: 1.2rem;
      cursor: pointer;
    }

  }

  .o-file-uploader {
    .tips {
      text-align: left;
    }

    .q-field__control {
      padding: 0!important;
    }
  }

  .o-field {
    margin-bottom: 8px;
  }
}
</style>
