<template>
  <o-simple-form-page class="ai-provider"
                      :loading="loading"
                      @submit="onSubmit"
                      enable-actions>
    <o-field :label="$t('name')" required>
      <q-input v-model="form.name" :placeholder="$t('name')"
               class="pi-field name"
               standout dense clearable
               :error="v$.name.$errors.length > 0"
               :error-message="$t('required')">
        <template #before>
          <div class="cursor-pointer">
            <o-icon :name="form.icon || '🍃'" />
            <o-general-icon-menu anchor="center left" self="center right"
                                 @select="onSelectIcon" />
          </div>
        </template>
      </q-input>
    </o-field>
    <o-field :label="$t('description')" required>
      <q-input v-model="form.desc" type="textarea" :placeholder="$t('description')"
               class="pi-field"
               counter maxlength="256"
               standout dense clearable>
      </q-input>
    </o-field>
    <o-field :label="$t('type')" side required v-if="false">
      <q-select v-model="form.type"
                class="col-md-6 col-sm-12 col-xs-12"
                :options="WorkspaceTypes"
                :error="v$.type.$errors.length > 0"
                :error-message="$t('required')"
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
import { onMounted } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import OSimpleFormPage from 'core/page/template/OSimpleFormPage.vue'
import { GET } from 'src/hooks/useRequest'
import { notifyWarning } from 'core/utils/control'
import useForm from 'src/hooks/useForm'
import { getErrorMessage } from 'src/utils/request'
import OGeneralIconMenu from 'components/icon/OGeneralIconMenu.vue'
import useMetadata from 'src/hooks/useMetadata'

const apiName = 'workspace'
const props = defineProps({
  id: {
    type: String,
    default: ''
  },
})
const emit = defineEmits(['success'])


const { WorkspaceTypes } = useMetadata()
const { form, loading, actions } = useForm()

const rules = {
  name: { required },
}
const v$ = useVuelidate(rules, form)

function load () {
  actions.initForm(apiName)
  if (props.id) {
    GET({name: apiName, query: {id: props.id}}).then((data) => {
      form.value.name = data.name
      form.value.desc = data.desc
      form.value.type = data.type
      form.value.icon = data.icon
    })
  } else {
    form.value.type = 'team'
    form.value.plan = 'basic'
    form.value.icon = '🍃'
  }
}

function onSelectIcon(options: Indexable) {
  form.value.icon = options.value
}

function onSubmit () {
  if (!actions.validate(v$)) {
    return
  }
  const body = {
    ...form.value,
    id: props.id,
  }

  actions.submit(
    body,
    (data) => {
      emit('success')
    },
    (err) => {
      const message = getErrorMessage(err)
      notifyWarning(message)
    }
  )
}

onMounted(() => {
  load()
})
</script>

<style lang="scss">
.ai-provider {
  .name {
    .q-field__before {
      width: 40px;
      color: unset!important;
      background: var(--q-accent);
      margin-right: 6px;
      padding: 0;
      border-radius: 4px;
      text-align: center;
      justify-content: center;
      align-items: center;

      .o-icon {
        font-size: 30px;
      }
    }
  }

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
