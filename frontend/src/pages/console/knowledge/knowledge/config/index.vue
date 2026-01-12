<template>
  <o-console-section class="config-tab"
                     icon="tune"
                     title="配置" extend-header>
    <template #header-extension>
      <div class="q-pb-sm text-tips">
        Update your knowledge base configuration here, particularly the chunk method.
      </div>
    </template>

    <q-splitter v-model="splitterPercent"
                unit="px"
                :limits="[200, 800]">
      <template #before>
        <o-simple-form enable-actions title="基本信息">
          <o-field label="名称" class="text-tips">
            <q-input v-model="form.name" placeholder="名称"
                     class="pi-field"
                     outlined dense
                     :error="v$.name.$errors.length > 0"
                     error-message="2-20字符"
                     hint="2-20字符" />
          </o-field>
          <o-field label="简介" class="text-tips">
            <q-input v-model="form.description" placeholder="简介"
                     type="textarea"
                     class="pi-field"
                     maxlength="256" counter
                     outlined dense autogrow
                     :error="v$.description.$errors.length > 0" />
          </o-field>
          <o-field label="Logo" class="text-tips">
            <o-file-uploader accept=".png,.jpg,.svg"
                             :maxSize="10 * 1024 * 1024"
                             :loading="loading" leading
                             @ready="onLogoReady" />
          </o-field>
        </o-simple-form>
      </template>

      <template #after>
        Right
      </template>
    </q-splitter>
  </o-console-section>
</template>

<script setup lang="ts">
import type { PropType} from 'vue'
import { computed, onActivated, ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import {maxLength, minLength, required} from '@vuelidate/validators'
import OConsoleSection from 'core/page/section/OConsoleSection.vue'
import OSimpleForm from 'core/page/section/OSimpleForm.vue'
import useForm from 'src/hooks/useForm'
import OField from 'core/components/form/field/OField.vue'
import OFileUploader from 'core/components/fIle/OFileUploader.vue'

const props = defineProps({
  knowledgeId: {
    type: String,
    required: true
  },
  knowledge: {
    type: Object as PropType<Indexable>,
    default: () => {}
  },
})

const { form, loading, actions } = useForm()

const rules = {
  name: { required, minLength: minLength(2), maxLength: maxLength(20) },
  description: { required, maxLength: maxLength(256) },
}
const v$ = useVuelidate(rules, form)

const splitterPercent = ref(400)

function onLogoReady() {
  //
}

onActivated(() => {
  form.value = props.knowledge
})
</script>

<style lang="scss">
.config-tab {
  .console-content {
    padding: 0 !important;
    .q-card {
      .content {
        height: calc(100vh - 172px);
        .q-splitter {
          height: 100%;
          &__separator {
            background: var(--q-accent);
          }
        }
      }
    }
  }

  .o-simple-form {
    .card-header {
      padding: 0 21px;
    }
    .card-content {
      padding: 0 21px;
    }
  }
}
</style>
