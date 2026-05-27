<template>
  <o-simple-form class="book-user q-px-md"
                 :loading="loading"
                 @submit="onSubmit"
                 @reset="actions.reset"
                 enable-actions>
    <!-- Basic -->
    <o-field-separator :label="$t('book.basicInfo')" />
    <o-field :label="$t('book.title')" side>
      <q-input :model-value="data.title"
               class="pi-field"
               standout dense clearable readonly />
    </o-field>
    <o-field :label="$t('reading.status._')" side>
      <q-btn-toggle
        v-model="form.readingStatus"
        color="accent"
        text-color="readable"
        toggle-color="primary"
        toggle-text-color="white"
        unelevated
        size="12px"
        :options="ReadingStatus.map(e => {
          return {label: e.label, value: e.value, icon: e.icon}
        })"
      />
    </o-field>
    <div class="row col-12 q-col-gutter-md">
      <div class="col-12">
        <o-field :label="$t('book.tags')" side>
          <q-input v-model="form.code" :placeholder="$t('book.tag')"
                   class="pi-field"
                   standout dense clearable />
        </o-field>
      </div>
      <div class="col-6">
        <o-field :label="$t('book.rating')" side>
          <q-slider v-model="form.rating"
                    :min="0" :max="10" :step="0.1"
                    label
                    :label-value="`${form.rating}`"
                    label-always
                    color="primary" class="rating" />
        </o-field>
      </div>
      <div class="col-6 ">
        <div class="row justify-end">
          <o-field :label="$t('book.mediaType.weread')" side>
            <q-toggle v-model="isWeread" />
          </o-field>
        </div>
      </div>
    </div>

    <!-- Physical Book -->
    <div class="row col-12 items-center q-mb-md q-col-gutter-md">
      <div class="col">
        <o-field-separator :label="$t('book.mediaType.physical')" />
      </div>
      <div class="col-auto">
        <q-toggle v-model="isPhysical" />
      </div>
    </div>
    <div class="row col-12 q-col-gutter-md" v-if="isPhysical">
      <div class="col-6">
        <o-field :label="$t('book.code')">
          <q-input v-model="form.code" :placeholder="$t('book.code')"
                   class="pi-field"
                   standout dense clearable />
        </o-field>
      </div>
      <div class="col-6">
        <o-field :label="$t('book.location')">
          <q-input v-model="form.location" :placeholder="$t('book.location')"
                   class="pi-field"
                   standout dense clearable />
        </o-field>
      </div>
    </div>
  </o-simple-form>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { onActivated, type PropType, ref } from 'vue'

import OSimpleForm from 'core/page/section/OSimpleForm.vue'
import OFieldSeparator from 'core/components/form/field/OFieldSeparator.vue'

import { notifyDone } from 'core/utils/control'
import { GET } from 'src/hooks/useRequest'
import useForm from 'src/hooks/useForm'
import useMetadata from 'src/hooks/useMetadata'
import { globalBus } from 'src/api/event/event-bus'

const apiName = 'userBook'
const props = defineProps({
  data: {
    type: Object as PropType<Indexable>,
    default: () => {}
  }
})
const emit = defineEmits(['close', 'success'])
const { form, loading, actions } = useForm()
const { ReadingStatus } = useMetadata()
const id = ref('')
const isPhysical = ref(false)
const isWeread = ref(false)

const rules = {
}
const v$ = useVuelidate(rules, form)

function load () {
  actions.initForm(apiName)

  id.value = props.data.userBookId
  if (id.value) {
    GET({name: apiName, query: {id: id.value}}).then(res => {
      form.value = res as Indexable
      isPhysical.value = res.isPhysical === 1
      isWeread.value = res.isWeread === 1
    })
  }
}

function onSubmit () {
  if (!actions.validate(v$)) {
    return
  }

  const body = {
    id: form.value.id || id.value,
    rating: form.value.rating,
    readingStatus: form.value.readingStatus,
    isPhysical: isPhysical.value ? 1 : -1,
    location: form.value.location,
    code: form.value.code,
    isWeread: isWeread.value ? 1 : -1,
  }

  actions.submit(body,(res) => {
    notifyDone()
    globalBus.emit('library-need-refresh', res)
  })
}

onActivated(() => {
  load()
})
</script>

<style lang="scss">
.book-user {
  .pi-field {
    .q-icon {
      font-size: 1.2rem;
      cursor: pointer;
    }
  }

  .q-btn-group {
    .q-btn {
      padding: 8px 12px;

      .on-left {
        margin-right: 8px;
      }
    }
  }

  .o-field .side {
    .main-label {
      min-width: 120px;
    }
  }
}
</style>
