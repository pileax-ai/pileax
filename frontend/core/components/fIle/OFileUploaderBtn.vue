<template>
  <section class="o-file-uploader-btn">
    <q-file v-model="value" class="file-uploader"
            :accept="accept"
            @update:model-value="updateFiles" outlined :disable="loading">
      <section class="row justify-center items-center panel">
        <o-refresh-btn icon="add"
                       tooltip="添加"
                       class="text-info"
                       :loading="loading" />
      </section>
    </q-file>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { notifyWarning } from 'core/utils/control';

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
    default: 500 * 1024 * 1024
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
});
const emit = defineEmits(['ready']);

const value = ref(null);
const selectedFile = ref<File>();
const src = ref('');
const error = ref('');

const fileIcon = computed(() => {
  if (selectedFile.value && selectedFile.value.type) {
    let type = selectedFile.value.type;
    if (type.indexOf('image/') === 0) {
      return 'image';
    } else if (type.indexOf('video/') === 0) {
      return 'videocam';
    } else if (type.indexOf('audio/') === 0) {
      return 'audiotrack';
    } else {
      return 'attach_file';
    }
  } else {
    return '';
  }
})

function updateFiles (file: File) {
  error.value = '';
  selectedFile.value = file;
  src.value = URL.createObjectURL(file);
  if (props.maxSize > 0) {
    const size = file.size;
    if (size > props.maxSize) {
      console.log('maxSize', size);
      error.value = '文件大小超出限制，请重新选择';
      notifyWarning('文件大小超出限制，请重新选择');
      return;
    }
  }
  emit('ready', file, fileIcon.value);
}

</script>

<style lang="scss">
.o-file-uploader-btn {
  position: relative;

  .file-uploader {
    min-width: 42px;
    min-height: 42px;
    width: 42px;
    border-radius: 4px;

    &:hover {
      background: var(--q-dark);
    }
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
    min-height: unset;
    padding: 0 6px;

    &:before {
      border-style: none;
    }
  }

  .q-field__native {
    min-height: unset;
  }

  .panel {
    position: absolute;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    //cursor: pointer;
    z-index: 0;

    .q-icon {
      font-size: 1.4rem;
    }

  }
}
</style>
