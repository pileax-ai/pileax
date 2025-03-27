<template>
  <o-simple-form-page class="stock-account"
                      :loading="loading"
                      @submit="onSubmit"
                      @reset="actions.reset"
                      enable-actions>
    <q-input v-model="form.id" prefix="ID" outlined dense readonly v-if="form.id"/>

    <q-select v-model="form.accountId" prefix="交易账户" readonly
              :options="stockAccountOptions" class="col-6"
              map-options emit-value outlined dense
              :error="v$.accountId.$errors.length > 0"
              error-message="必填" />
    <q-input v-model="form.dateKey" prefix="日期"
             mask="####-##-##" class="col-md-6 col-sm-12 col-xs-12"
             outlined dense
             :error="v$.dateKey.$errors.length > 0"
             error-message="必填">
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="form.dateKey" mask="YYYY-MM-DD" color="primary" />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <q-input v-model="form.totalAsset" prefix="资产总值"
             type="number" step="0.0001" suffix="￥"
             :error="v$.totalAsset.$errors.length > 0"
             outlined dense/>
    <q-input v-model="form.marketValue" prefix="市值"
             type="number" step="0.0001" suffix="￥"
             :error="v$.marketValue.$errors.length > 0"
             outlined dense/>
    <q-input v-model="form.stockNum" prefix="股票数"
             type="number" step="1" suffix="支"
             :error="v$.stockNum.$errors.length > 0"
             outlined dense/>
    <o-editor v-model="form.note" label="备注"
              min-height="200px"
              max-height="400px"
              enable-toolbar />

    <q-toggle v-model="status" label="启用"/>
  </o-simple-form-page>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core';
import {required} from '@vuelidate/validators';
import {onMounted, ref} from 'vue';

import OSimpleFormPage from 'core/page/template/OSimpleFormPage.vue';
import OEditor from 'components/input/o-editor.vue';

import {GET} from 'src/hooks/useRequest';
import useForm from 'src/hooks/useForm';
import useBusiness from 'src/hooks/useBusiness';

const {
  stockAccountOptions,
} = useBusiness();

const apiName = 'stockAsset';
const props = defineProps({
  id: {
    type: Number,
    default: 0
  },
  accountId: {
    type: Number,
    default: 0
  }
});
const emit = defineEmits(['success']);
const {form, loading, actions} = useForm();
const status = ref(true);
const rules = {
  accountId: { required },
  dateKey: { required },
  totalAsset: {required},
  marketValue: {required},
  stockNum: {required},
};
const v$ = useVuelidate(rules, form);

function load() {
  actions.initForm(apiName);

  if (props.id) {
    GET({name: apiName, query: {id: props.id}}).then(res => {
      form.value = res.data;
      status.value = res.data.status === 1;
    })
  }
  form.value.accountId = props.accountId;
}

function onSubmit() {
  if (!actions.validate(v$)) {
    return;
  }

  const body = {
    ...form.value,
    id: form.value.id || props.id,
    code: form.value.symbol,
    status: status.value ? 1 : 0,
  };

  actions.submit(body, () => {
    emit('success');
  });
}

onMounted(() => {
  load();
})
</script>

<style lang="scss">
.stock {
}
</style>
