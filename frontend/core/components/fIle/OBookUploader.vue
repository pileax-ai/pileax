<template>
  <section class="o-book-uploader">
    <q-file v-model="value" class="file-uploader"
            :accept="accept"
            @update:model-value="updateFiles"
            multiple
            outlined>
      <section class="row col-12 justify-center items-center text-info panel">
        <section class="col-12 text-center tips">
          <div v-if="upload.progress">
            <q-circular-progress
              show-value
              font-size="12px"
              :value="upload.progress"
              size="80px"
              :thickness="0.12"
              color="primary"
              track-color="grey-3"
              class="q-ma-md"
            >
              {{ upload.progress.toFixed(2) }}%
            </q-circular-progress>
            <div class="text-bold">
              {{ upload.success }} / {{ upload.total }}
            </div>
          </div>
          <div v-else>
            <div class="text-tips">
              <q-icon name="cloud_upload" size="3rem" />
            </div>
            <div class="text-tips">
              <span>{{ label || $t('book.uploader.label') }}</span>
            </div>
            <div class="q-mt-md limit" :class="{ 'text-red': error }">
              <template v-for="(item, index) in accept.split(',')">
                <o-badge>{{item.replaceAll('.', '').toUpperCase()}}</o-badge>
              </template>
              <q-chip square dense>
                <q-avatar color="red" text-color="white">Max</q-avatar>
                <span>{{maxSize / (1024 * 1024)}}M</span>
              </q-chip>
            </div>
          </div>
        </section>
      </section>
    </q-file>
    <div class="text-tips q-mt-sm tips">
      {{ tips }}
    </div>

    <slot></slot>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { uploadBook } from 'src/api/service/ebook/book'
import { notifyInfo } from 'core/utils/control'
import useCommon from 'core/hooks/useCommon'

defineProps({
  accept: {
    type: String,
    default: `*`
  },
  maxSize: {
    type: Number,
    default: 100 * 1024 * 1024
  },
  label: {
    type: String,
    default: ''
  },
  tips: {
    type: String,
    default: ''
  },
})
const emit = defineEmits(['completed'])

const { t, confirm } = useCommon()
const value = ref(null)
const error = ref('')
const upload = reactive({
  total: 0,
  success: 0,
  progress: 0
})

const updateFiles = async (files: File[]) => {
  if (!files.length) return

  upload.total = files.length
  for (let i = 0; i < upload.total; i++) {
    upload.progress = (i + 1) / upload.total * 100
    const file = files.at(i)

    try {
      const book = await uploadBook(file!) as Indexable
      upload.success += 1
    } catch (err) {
      console.error(err)
    }
  }

  const message = `<div class="text-bold">${t('book.uploader.completed')}</div>
    <div class="caption"${t('book.uploader.total')}: ${upload.total} </div>
    <div class="caption">${t('book.uploader.success')}: ${upload.success}</div>`
  notifyInfo(message, {
      icon: 'check_circle',
      position: 'top-right',
      timeout: 5000,
      progress: true,
      html: true
    }
  )

  Object.assign(upload, { total: 0, success: 0, progress: 0 })
  emit('completed', files)
}
</script>

<style lang="scss">
.o-book-uploader {
  position: relative;
  min-width: 400px;

  .file-uploader {
    min-height: 160px;
  }

  .tips {
    font-size: 12px;
    text-align: center;
  }

  .q-field {
    margin: 0 !important;
  }

  .q-field__native {
    align-items: start!important;
    z-index: 1;
    padding: 0 !important;

    div {
      display: none;
      background: red;
    }
  }

  .q-field__control {
    height: 100%;
    padding: 0 6px;

    &:before {
      border-style: dashed;
    }
  }

  .panel {
    position: absolute;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 0;

    img {
      max-height: 120px;
      max-width: 100%;
    }

    .limit {
      font-size: 0.9rem;

      .q-chip {
        height: 20px;
        margin: 0 4px 2px 4px;

        .q-avatar {
          padding: 0 4px;
          width: unset;
          height: 20px;
        }

        span {
          font-size: 0.9rem;
        }
      }
    }
  }
}
</style>
