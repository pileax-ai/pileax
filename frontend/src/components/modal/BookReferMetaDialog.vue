<template>
  <o-common-dialog class="book-refer-meta-dialog dialog-theme"
                   :show="dialog.type === 'book-refer-meta'"
                   :content-style="style"
                   @close="onHide"
                   @ok="onOk"
                   show-ok
                   show-cancel>
    <header class="row justify-center items-center" v-touch-pan.prevent.mouse="onPan">
      <q-icon name="mdi-tune-variant" />
    </header>
    <section class="content">
      <div class="title">
        {{ note.title }}
      </div>
      <o-simple-form content-class="q-py-md">
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
    </section>
  </o-common-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import useVuelidate from '@vuelidate/core'
import { maxLength, required } from '@vuelidate/validators'

import OCommonDialog from 'core/components/dialog/OCommonDialog.vue'
import OSimpleForm from 'core/page/section/OSimpleForm.vue'

import useForm from 'src/hooks/useForm'
import useDialog from 'core/hooks/useDialog'
import useBookNote from 'src/hooks/useBookNote'
import { notifyDone } from 'core/utils/control'

const {
  saveNoteRemote
} = useBookNote()
const { dialog, onHide } = useDialog()
const { form, actions } = useForm()
const pos = reactive({ x: 0, y: 0 })
const rules = {
  chapter: { required, maxLength: maxLength(100) },
  page: { required },
}
const v$ = useVuelidate(rules, form)

const style = computed(() => {
  return {
    minWidth: '540px',
    maxWidth: '540px',
    padding: '0px',
    transform: `translate(${pos.x}px, ${pos.y}px)`
  }
})

const note = computed(() => dialog.value.data)

const onPan = (evt: any) => {
  pos.x += evt.delta.x
  pos.y += evt.delta.y
}

function onOk() {
  if (!actions.validate(v$)) {
    return
  }

  saveNoteRemote({
    id: note.value.id,
    chapter: form.value.chapter,
    page: form.value.page || 0,
  }).then(res => {
    notifyDone()
    onHide()
  })
}

onMounted(() => {
  form.value.chapter = note.value.chapter
  form.value.page = note.value.page
})
</script>

<style lang="scss">
@import "./dialog-theme";
.book-refer-meta-dialog {
}
</style>
