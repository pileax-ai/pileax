<template>
  <section class="row col-12 justify-center o-editor">
    <header class="col-12 q-pb-xs">
      <div class="row col-12 justify-center" v-if="preview">
        <q-btn-toggle
          v-model="view"
          color="tips"
          text-color="tips"
          toggle-color="primary"
          toggle-text-color="white"
          rounded
          unelevated
          :options="[
            {value: 'desktop', icon: 'computer'},
            {value: 'mobile', icon: 'smartphone'},
          ]"
        />
      </div>
      <div class="text-readable" v-if="label">
        {{ label }}
      </div>
    </header>

    <q-editor v-model="content" ref="editor"
              class="col-12 editor"
              :class="{'view-mobile shadow-5': view === 'mobile'}"
              placeholder="内容" outlined
              :min-height="minHeight"
              :max-height="maxHeight"
              @update:model-value="onUpdate"
              :toolbar="toolbar"
              :fonts="fonts">
      <template #media>
        <q-btn icon="image" size="10px" flat dense>
        </q-btn>
        <q-btn icon="videocam" size="10px" flat dense>
        </q-btn>
      </template>
    </q-editor>
  </section>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue'
import { useQuasar } from 'quasar'

const props = defineProps({
  modelValue: {
    type: null as unknown as PropType<string | null>,
    required: false
  },
  preview: {
    type: Boolean,
    default: false
  },
  enableToolbar: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'image'
  },
  minHeight: {
    type: String,
    default: '400px'
  },
  maxHeight: {
    type: String,
    default: '640px'
  },
})
const emit = defineEmits(['update:modelValue'])

const $q = useQuasar()

const editor = ref()
const view = ref('desktop')
const content = ref('')
const toolbar  = computed(() => {
  return !props.enableToolbar ? [] : [
    ['bold', 'italic', 'strike', 'underline'],
    [
      {
        icon: $q.iconSet.editor.fontSize,
        fixedLabel: true,
        fixedIcon: true,
        list: 'no-icons',
        options: [
          'size-1',
          'size-2',
          'size-3',
          'size-4',
          'size-5',
          'size-6',
          'size-7'
        ]
      },
      {
        icon: $q.iconSet.editor.font,
        fixedIcon: true,
        list: 'no-icons',
        options: [
          'default_font',
          'arial',
          'arial_black',
          'comic_sans',
          'courier_new',
          'impact',
          'lucida_grande',
          'times_new_roman',
          'verdana'
        ]
      },
      'removeFormat'
    ],
    [
      {
        icon: $q.iconSet.editor.align,
        fixedLabel: true,
        list: 'only-icons',
        options: ['left', 'center', 'right', 'justify']
      },
      {
        icon: 'more_horiz',
        options: ['quote', 'unordered', 'ordered', 'outdent', 'indent']
      }
    ],
    ['media'],
    ['viewsource'] // fullscreen
  ]
})
const fonts = computed(() => {
  return {
    arial: 'Arial',
    arial_black: 'Arial Black',
    comic_sans: 'Comic Sans MS',
    courier_new: 'Courier New',
    impact: 'Impact',
    lucida_grande: 'Lucida Grande',
    times_new_roman: 'Times New Roman',
    verdana: 'Verdana'
  }
})

function init () {
  content.value = props.modelValue
}
function onUpdate () {
  emit('update:modelValue', content.value)
}

function onUploadImage (link) {
  editor.value.runCmd('insertHTML',  '<p><img src="' + link + '" /></p>', true)
}

function onUploadVideo (link) {
  editor.value.runCmd('insertHTML',  '<p><video controls><source src="' + link + '" /></video></p>', true)
}

const fileMeta = computed(() => {
  {
    let accept = '*'
    let maxSize = 0
    switch (props.type) {
      case 'image':
        accept = '.png, .jpg, .jpeg, .gif'
        maxSize = 20 * 1024 * 1024 // 20M
        break
      case 'video':
        accept = '.webm, .mp4, .m4v, .ogv, .ogg'
        maxSize = 500 * 1024 * 1024 // 500M
        break
      case 'audio':
        accept = '.mp3, .wav, .oga'
        maxSize = 50 * 1024 * 1024 // 50M
        break
      case 'model':
        accept = '.gltf, .glb'
        maxSize = 100 * 1024 * 1024 // 100M
        break
      default:
        accept = '*'
        break
    }
    return { accept, maxSize }
  }
})

watch(() => props.modelValue, (newValue) => {
  content.value = newValue
})

onMounted(() => {
  init()
})
</script>

<style lang="scss">
.o-editor {
  img, audio, video {
    max-width: 100%;
  }


  .view-mobile {
    width: 390px;
    border-radius: 10px;

    .q-editor__toolbars-container {
      display: none;
    }

    .q-editor__content {
      div, img {
        max-width: 368px;
      }
    }
  }

  .q-editor__toolbars-container {
    .q-btn-dropdown__arrow {
      margin-left: 0!important;
    }
  }
}
</style>
