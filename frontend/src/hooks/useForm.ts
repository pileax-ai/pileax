import { ref } from 'vue';
import { POST, PUT } from 'src/hooks/useRequest';
import { Ref } from 'vue-demi';
import { BaseValidation } from '@vuelidate/core';

export default function () {
  const apiName = ref('');
  const form = ref<Indexable>({});
  const loading = ref(false);
  const vuelidate: Ref<BaseValidation | null> = ref(null);

  function initForm(api: string) {
    apiName.value = api;
  }

  function validate(v$: any) {
    vuelidate.value = v$.value;
    v$.value.$touch();
    if (v$.value.$error) {
      return false;
    } else {
      return true;
    }
  }

  function submit (body: Indexable, callback: (res: any) => any) {
    loading.value = true;
    if (body.id) {
      PUT({name: apiName.value, body: body}).then(res => {
        postSubmit(res as Indexable, callback);
      }).catch(() => {
        loading.value = false;
      })
    } else {
      delete body.id
      POST({name: apiName.value, body: body}).then(res => {
        postSubmit(res as Indexable, callback);
      }).catch(() => {
        loading.value = false;
      })
    }
  }

  function postSubmit (data: Indexable, callback: (res: any) => any) {
    loading.value = false;
    form.value.id = data.id;
    vuelidate.value?.$reset();

    if (typeof callback === 'function') {
      callback(data);
    }
  }

  function reset() {
    form.value = {};
    vuelidate.value?.$reset();
  }

  const actions = {
    initForm,
    validate,
    submit,
    reset
  };

  return {
    form,
    loading,

    actions
  };
}
