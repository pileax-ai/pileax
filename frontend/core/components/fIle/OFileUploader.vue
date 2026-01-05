<template>
  <section class="o-file-uploader">
    <q-file v-model="value" class="file-uploader"
            :accept="accept"
            @update:model-value="updateFiles" outlined>
      <section class="row col-12 justify-center items-center text-info panel">
        <section class="col-12 text-center tips">
          <div class="row items-center bg-accent q-pa-md rounded-borders" v-if="fileIcon">
            <div class="col-auto" style="width: 4rem" v-if="leading">
              <template v-if="loading">
                <q-spinner-puff size="3rem" color="primary" />
              </template>
              <template v-else>
                <q-icon :name="icon || fileIcon" color="green" size="2rem" v-if="done" />
                <q-icon name="error" color="red" size="2rem" v-else />
              </template>
            </div>
            <div class="row col justify-center relative-position">
              <img :src="src" />
            </div>
            <div class="col-12" v-if="error">
              <div class="text-red text-bold">
                {{error}}
              </div>
              <div class="q-mt-md text-tips limit">
                <template v-for="(item, index) in accept.split(',')" :key="index">
                  <o-badge>{{item.replaceAll('.', '').toUpperCase()}}</o-badge>
                </template>
                <q-chip square dense>
                  <q-avatar color="red" text-color="white">Max</q-avatar>
                  <span>{{maxSize / (1024 * 1024)}}M</span>
                </q-chip>
              </div>
            </div>
          </div>
          <section class="text-center tips" v-else-if="loading">
            <div>
              <q-spinner-puff size="4rem" color="primary" />
            </div>
          </section>
          <div v-else>
            <template v-if="preview">
              <img :src="preview" />
            </template>
            <template v-else>
              <div class="text-tips">
                <q-icon name="cloud_upload" size="3rem" />
              </div>
              <div class="text-tips">
                <span>{{ label || $t('book.uploader.label') }}</span>
              </div>
              <div class="q-mt-md limit" :class="{ 'text-red': error }">
                <template v-for="(item, index) in accept.split(',')" :key="index">
                  <o-badge>{{item.replaceAll('.', '').toUpperCase()}}</o-badge>
                </template>
                <q-chip square dense>
                  <q-avatar color="red" text-color="white">Max</q-avatar>
                  <span>{{maxSize / (1024 * 1024)}}M</span>
                </q-chip>
              </div>
            </template>
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
import { computed, ref } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: `image`
  },
  accept: {
    type: String,
    default: `*`
  },
  maxSize: {
    type: Number,
    default: 100 * 1024 * 1024
  },
  icon: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  preview: {
    type: String,
    default: ''
  },
  tips: {
    type: String,
    default: ''
  },
  leading: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  done: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['ready'])

const value = ref(null)
const selectedFile = ref<File>()
const src = ref('')
const error = ref('')

const fileIcon = computed(() => {
  if (selectedFile.value && selectedFile.value.type) {
    const type = selectedFile.value.type
    if (type.indexOf('image/') === 0) {
      return 'image'
    } else if (type.indexOf('video/') === 0) {
      return 'videocam'
    } else if (type.indexOf('audio/') === 0) {
      return 'audiotrack'
    } else {
      return 'attach_file'
    }
  } else {
    return ''
  }
})

function updateFiles (file: File) {
  error.value = ''
  selectedFile.value = file
  src.value = URL.createObjectURL(file)
  if (props.maxSize > 0) {
    const size = file.size
    if (size > props.maxSize) {
      console.log('maxSize', size)
      error.value = '文件大小超出限制，请重新选择'
      return
    }
  }
  emit('ready', file, fileIcon.value)
}

</script>

<style lang="scss">
.o-file-uploader {
  position: relative;

  .file-uploader {
    //min-width: 400px;
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
    //cursor: pointer;
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
