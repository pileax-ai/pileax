<template>
  <o-simple-form-page class="book-upload"
                      :loading="loading"
                      @reset="actions.reset">
    <o-field :label="$t('name')">
      <q-input v-model="form.title"
               class="pi-field"
               standout dense clearable readonly />
    </o-field>
    <o-field :label="$t('book.author')">
      <q-input v-model="form.author"
               class="pi-field"
               standout dense clearable readonly />
    </o-field>

    <o-field v-if="data.id">
      <o-book-uploader :data="data"
                       :accept="bookAccept"
                       :max-size="500 * 1024 * 1024"
                       leading
                       @completed="onUploadCompleted" />
    </o-field>
  </o-simple-form-page>
</template>

<script setup lang="ts">
import { onMounted, type PropType, ref } from 'vue'

import OSimpleFormPage from 'core/page/template/OSimpleFormPage.vue'
import OBookUploader from 'core/components/fIle/OBookUploader.vue'

import useForm from 'src/hooks/useForm'

const props = defineProps({
  data: {
    type: Object as PropType<Indexable>,
    default: () => {}
  }
})
const emit = defineEmits(['close', 'success'])
const { form, loading, actions } = useForm()
const bookAccept = ref('.epub,.mobi,.azw3,.fb2,.cbz,.pdf')

function load () {
  form.value = props.data
}

function onUploadCompleted() {
  emit('close')
}

onMounted(() => {
  load()
})
</script>

<style lang="scss">
.book-upload {
}
</style>
