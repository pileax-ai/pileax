<template>
  <o-sheet v-model="show"
           :title="$t('book.refInfo')"
           @update:modelValue="emit('update:modelValue', $event)">
    <o-simple-form content-class="q-pa-md" enable-actions @submit="onSubmit">
      <o-field :label="$t('book.chapter')" required>
        <q-input v-model="form.chapter" :placeholder="$t('book.chapter')"
                 class="pi-field"
                 standout dense clearable
                 :error="v$.chapter.$errors.length > 0"
                 :error-message="$t('formRules.length', {length: '1-100'})"
                 :hint="$t('formRules.length', {length: '1-100'})" />
      </o-field>
      <o-field :label="$t('book.page')" required>
        <q-input v-model="form.page" :placeholder="$t('book.page')"
                 type="number"
                 class="pi-field"
                 standout dense clearable
                 :error="v$.chapter.$errors.length > 0"
                 :error-message="$t('required')" />
      </o-field>
    </o-simple-form>
  </o-sheet>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import useVuelidate from '@vuelidate/core'
import useForm from 'src/hooks/useForm'

import OSheet from 'core/components/dialog/OSheet.vue'
import OSimpleForm from 'core/page/section/OSimpleForm.vue'
import { maxLength, required } from '@vuelidate/validators'
import useBookNote from 'src/hooks/useBookNote'
import { notifyDone } from 'core/utils/control'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:modelValue'])

const {
  note,
  noteId,
  saveNoteRemote
} = useBookNote()
const show = ref(false)
const { form, actions } = useForm()

const rules = {
  chapter: { required, maxLength: maxLength(100) },
  page: { required },
}
const v$ = useVuelidate(rules, form)

watch(() => props.modelValue, () => {
  show.value = props.modelValue
})

function onSubmit() {
  if (!actions.validate(v$)) {
    return
  }

  saveNoteRemote({
    id: noteId.value,
    chapter: form.value.chapter,
    page: form.value.page || 0,
  }).then(res => {
    notifyDone()
    show.value = false
    emit('update:modelValue', false)
  })
}

onMounted(() => {
  show.value = props.modelValue
  form.value.chapter = note.value.chapter
  form.value.page = note.value.page
})
</script>

<style lang="scss">
.book-note-meta {
  border-radius: 12px;
}
</style>
