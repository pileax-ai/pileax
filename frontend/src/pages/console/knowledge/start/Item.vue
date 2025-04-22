<template>
  <o-simple-form-page class="knowledge"
                      :loading="loading"
                      @submit="onSubmit"
                      @reset="actions.reset"
                      enable-actions>
    <q-input v-model="form.id" prefix="ID" outlined dense readonly v-if="form.id && false"/>
    <q-input v-model="form.name" prefix="名称"
             class="pi-field"
             standout dense
             :error="v$.name.$errors.length > 0"
             error-message="2-20字符"
             hint="2-20字符" />
    <q-input v-model="form.description" prefix="简介"
             type="textarea"
             class="pi-field"
             maxlength="256" counter
             standout dense
             :error="v$.description.$errors.length > 0" />
    <o-field label="Logo" v-if="form.id">
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

const apiName = 'knowledge';
const props = defineProps({
  id: {
    type: String,
    default: ''
  }
});
const emit = defineEmits(['success']);
const { form, loading, actions } = useForm();
const status = ref(true);

const rules = {
  name: { required, minLength: minLength(2), maxLength: maxLength(20) },
  description: { required, maxLength: maxLength(256) },
};
const v$ = useVuelidate(rules, form);

function load () {
  actions.initForm(apiName);

  if (props.id) {
    GET({name: apiName, query: {id: props.id}}).then((data) => {
      form.value = data as Indexable;
      status.value = form.value.status === 1;
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
    ...form.value,
    id: form.value.id || props.id,
    status: status.value ? 1 : 0,
  };

  actions.submit(body,() => {
    emit('success');
  });
}

onMounted(() => {
  load();
})
</script>

<style lang="scss">
.knowledge {
}
</style>
