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
               error-message="必填">
        <template #prepend>
          <div class="cursor-pointer">
            <o-icon :name="form.icon || '🍃'" />
            <o-general-icon-menu @emoji="onSelectEmoji"
                                 @icon="onSelectIcon" />
          </div>
        </template>
      </q-input>
    </o-field>
    <o-field label="类型" side required>
      <q-select v-model="form.type"
                class="col-md-6 col-sm-12 col-xs-12"
                :options="WorkspaceTypes"
                :error="v$.type.$errors.length > 0"
                error-message="必填"
                map-options
                emit-value
                standout dense readonly />
    </o-field>

    <template #control>
      <footer class="row col-12 items-center justify-center bg-accent text-tips">
        Share workspaces.
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
import { ConnectionStatus, getArrayItem, WorkspaceTypes } from 'src/app/metadata'
import { notifyWarning } from 'core/utils/control'
import useForm from 'src/hooks/useForm';
import { getErrorMessage } from 'src/utils/request'
import OGeneralIconMenu from 'components/icon/OGeneralIconMenu.vue'

const apiName = 'workspace';
const props = defineProps({
  id: {
    type: String,
    default: ''
  },
});
const emit = defineEmits(['success']);
const { form, loading, actions } = useForm();

const rules = {
  name: { required },
  type: { required },
};
const v$ = useVuelidate(rules, form);

function load () {
  actions.initForm(apiName);
  if (props.id) {
    GET({name: apiName, query: {id: props.id}}).then((data) => {
      form.value.name = data.name;
      form.value.type = data.type;
    })
  } else {
    form.value.type = 'team';
    form.value.plan = 'basic';
    form.value.icon = '🍃';
  }
}

function onSelectEmoji(options: Indexable) {
  console.log('emoji', options)
  form.value.icon = options.emoji
}

function onSelectIcon(options: Indexable) {
  console.log('icon', options)
  form.value.icon = options.name
}

function onSubmit () {
  if (!actions.validate(v$)) {
    return;
  }
  const body = {
    ...form.value,
    id: props.id,
  }

  actions.submit(
    body,
    (data) => {
      emit('success');
    },
    (err) => {
      if (err.response.status === 403) {
        notifyWarning('API Key 无效')
      } else {
        const message = getErrorMessage(err)
        notifyWarning(message)
        console.error(err)
      }
    }
  );
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

  .link {
    font-size: 0.9rem;
  }
}
</style>
