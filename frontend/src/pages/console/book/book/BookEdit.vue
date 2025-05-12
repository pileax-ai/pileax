<template>
  <o-simple-form-page class="book-edit"
                      :loading="loading"
                      @submit="onSubmit"
                      @reset="actions.reset"
                      enable-actions>
    <q-input v-model="form.id" prefix="ID" outlined dense readonly v-if="form.id && false"/>
    <q-input v-model="form.title" prefix="名称"
             class="pi-field"
             standout dense
             :error="v$.title.$errors.length > 0"
             error-message="1-100字符"
             hint="1-100字符" />
    <q-input v-model="form.author" prefix="作者"
             class="pi-field"
             standout dense
             :error="v$.author.$errors.length > 0"
             error-message="1-100字符"
             hint="1-100字符" />
    <q-input v-model="form.publisher" prefix="出版社"
             class="pi-field"
             standout dense />
    <q-input v-model="form.description" prefix="简介"
             type="textarea"
             class="pi-field"
             maxlength="256" counter
             standout dense />
    <o-field label="封面" v-if="form.id">
      <o-file-uploader accept=".png,.jpg,.svg"
                       :maxSize="10 * 1024 * 1024"
                       :loading="loading" leading
                       @ready="onLogoReady" />
    </o-field>

    <q-toggle v-model="status" label="启用" class="col-6"/>
  </o-simple-form-page>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core';
import {maxLength, minLength, required} from '@vuelidate/validators';
import { onMounted, ref} from 'vue';

import OFileUploader from 'core/components/fIle/OFileUploader.vue';
import OSimpleFormPage from 'core/page/template/OSimpleFormPage.vue';

import { GET } from 'src/hooks/useRequest';
import useForm from 'src/hooks/useForm';
import OField from 'core/components/form/field/OField.vue'

const apiName = 'book';
const props = defineProps({
  id: {
    type: String,
    default: ''
  }
});
const emit = defineEmits(['close', 'success']);
const { form, loading, actions } = useForm();
const status = ref(true);

const rules = {
  title: { required, minLength: minLength(1), maxLength: maxLength(100) },
  author: { required, minLength: minLength(1), maxLength: maxLength(100) },
};
const v$ = useVuelidate(rules, form);

function load () {
  actions.initForm(apiName);

  if (props.id) {
    GET({name: apiName, query: {id: props.id}}).then((data) => {
      form.value = data as Indexable;
    })
  }
}

function onLogoReady() {
  //
}

function onSubmit () {
  if (!actions.validate(v$)) {
    return;
  }

  const body = {
    id: form.value.id || props.id,
    title: form.value.title,
    author: form.value.author,
    publisher: form.value.publisher,
    description: form.value.description,
  };

  actions.submit(body,() => {
    emit('close');
  });
}

onMounted(() => {
  load();
})
</script>

<style lang="scss">
.book-edit {
}
</style>
