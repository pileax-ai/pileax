<template>
  <o-simple-form-page class="ai-provider"
                      :loading="loading"
                      @submit="onSubmit"
                      enable-actions>
    <o-field label="Name" required>
      <q-input v-model="form.name" placeholder="Name"
               class="pi-field"
               standout dense clearable
               :error="v$.name.$errors.length > 0"
               error-message="必填" />
    </o-field>
    <o-field label="API Key" required>
      <q-input v-model="form.apiKey" placeholder="API Key"
               :type="isPwd ? 'password' : 'text'"
               class="pi-field"
               standout dense clearable
               :error="v$.apiKey.$errors.length > 0"
               error-message="必填">
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>
    </o-field>
    <o-field label="Custom API endpoint URL">
      <q-input v-model="form.baseUrl" placeholder="API Base URL"
               class="pi-field"
               standout dense clearable />
    </o-field>

    <section class="row col-12 justify-between connection" v-if="testable">
      <q-btn label="测试连通性" class="bg-cyan text-white" flat
             :loading="testing"
             @click="getModels" />
      <div>
        <o-badge v-bind="getArrayItem(ConnectionStatus, `${connectionStatus}`)" />
      </div>
    </section>

    <template #control>
      <footer class="row col-12 items-center justify-center bg-accent text-tips">
        Your API KEY will be encrypted and stored using PKCS1_OAEP technology.
      </footer>
    </template>
  </o-simple-form-page>
</template>

<script setup lang="ts">
import { onMounted, PropType, ref } from 'vue';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

import OSimpleFormPage from 'core/page/template/OSimpleFormPage.vue';
import OBadge from 'core/components/misc/OBadge.vue'
import { GET } from 'src/hooks/useRequest'
import { ConnectionStatus, getArrayItem } from 'src/app/metadata'
import { notifyWarning } from 'core/utils/control'
import useForm from 'src/hooks/useForm';

const apiName = 'providerCredential';
const props = defineProps({
  id: {
    type: String,
    default: ''
  },
  data: {
    type: Object as PropType<Indexable>,
    default: () => {}
  }
});
const emit = defineEmits(['success']);
const { form, loading, actions } = useForm();

const isPwd = ref(true);
const models = ref<Indexable[]>([]);
const testable = ref(true);
const testing = ref(false);
const connectionStatus = ref(0);

const rules = {
  name: { required },
  apiKey: { required },
};
const v$ = useVuelidate(rules, form);

function load () {
  actions.initForm(apiName);
  if (props.id) {
    GET({name: apiName, query: {id: props.id}}).then((data) => {
      form.value.name = data.name;
      form.value.apiKey = data.credential.apiKey;
      form.value.baseUrl = data.credential.baseUrl;
    })
  }
}

function onSubmit () {
  if (!actions.validate(v$)) {
    return;
  }
  const body = {
    id: props.id,
    name: form.value.name,
    provider: props.data.name,
    credential: {
      api_key: form.value.apiKey,
      base_url: form.value.baseUrl || props.data.baseUrl || ''
    }
  }

  actions.submit(body,(data) => {
    emit('success');
  });
}

function getModels() {
  const query = { provider: props.data.name };
  testing.value = true;
  GET({ name: 'aiProvider', path: '/models', query: query }).then(res => {
    models.value = res as Indexable[];
    connectionStatus.value = 1;
    testing.value = false;
  }).catch(err => {
    connectionStatus.value = -1;
    testing.value = false;
    notifyWarning('当前大模型无法连通，请检查配置！')
  })
}

onMounted(() => {
  load();
})
</script>

<style lang="scss">
.ai-provider {
  .q-field__prefix {
    min-width: 80px;
  }

  .connection {
    .o-badge {
      padding: 8px;
      margin: 0;
      font-size: 1rem;
      .q-icon {
        font-size: 1rem;
      }
    }
  }
}
</style>
