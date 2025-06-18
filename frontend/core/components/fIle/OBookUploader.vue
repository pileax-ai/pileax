<template>
  <section class="o-book-uploader">
    <q-file v-model="value" class="file-uploader"
            :accept="accept"
            @update:model-value="updateFiles"
            multiple
            outlined>
      <section class="row col-12 justify-center items-center text-info panel">
        <section class="col-12 text-center tips">
          <div v-if="progress">
            <q-circular-progress
              show-value
              font-size="12px"
              :value="progress"
              size="80px"
              :thickness="0.12"
              color="primary"
              track-color="grey-3"
              class="q-ma-md"
            >
              {{ progress.toFixed(2) }}%
            </q-circular-progress>
          </div>
          <div v-else>
            <div class="text-tips">
              <q-icon name="cloud_upload" size="3rem" />
            </div>
            <div class="text-tips">
              <span>{{ label || '将文件拖到此处，或点击上传' }}</span>
            </div>
            <div class="q-mt-md text-bold limit" :class="{ 'text-red': error }">
              <span>接受 {{accept?.replaceAll('.',  '').toUpperCase()}}.</span>
              <span class="q-ml-md">最大 {{maxSize / (1024 * 1024)}}mb.</span>
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
  label: {
    type: String,
    default: ''
  },
  tips: {
    type: String,
    default: ''
  },
  progress: {
    type: Number,
    default: 0
  },
});
const emit = defineEmits(['ready']);

const value = ref(null);
const error = ref('');

function updateFiles (files: File[]) {
  emit('ready', files);
}
</script>

<style lang="scss">
.o-book-uploader {
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
      //opacity: 0.5;
    }
  }
}
</style>
