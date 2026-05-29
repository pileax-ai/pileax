<template>
  <o-simple-form class="book-general"
                 :loading="loading"
                 @reset="actions.reset">
    <div class="row col-12 q-col-gutter-md">
      <div class="col-auto">
        <o-file-uploader :preview="getFileUrl(form.coverUrl)"
                         readonly />
      </div>
      <div class="col">
        <o-field :label="$t('book.title')">
          <q-input v-model="form.title"
                   class="pi-field"
                   standout dense readonly />
        </o-field>
        <o-field :label="$t('book.author')">
          <q-input v-model="form.author"
                   class="pi-field"
                   standout dense readonly />
        </o-field>
      </div>
    </div>

    <!-- Basic Info -->
    <o-field-separator :label="$t('book.basicInfo')"
                       class="q-py-md" />
    <div class="row col-12 q-col-gutter-md">
      <div class="col-6">
        <o-field :label="$t('book.subtitle')">
          <q-input v-model="form.subtitle" placeholder="NA"
                   class="pi-field"
                   standout dense readonly />
        </o-field>
        <o-field :label="$t('book.publisher')">
          <q-input v-model="form.publisher" placeholder="NA"
                   class="pi-field"
                   standout dense readonly />
        </o-field>
        <o-field :label="$t('language')">
          <q-input v-model="form.language" placeholder="NA"
                   class="pi-field"
                   standout dense readonly />
        </o-field>
      </div>
      <div class="col-6">
        <o-field label="ISBN">
          <q-input v-model="form.isbn" placeholder="9780xxxxxxxxx"
                   class="pi-field"
                   standout dense clearable readonly />
        </o-field>
        <o-field :label="$t('book.published')">
          <q-input v-model="form.published" placeholder="YYYYY-MM"
                   class="pi-field"
                   standout dense readonly />
        </o-field>
        <o-field :label="$t('book.link')">
          <q-input v-model="form.refUrl" placeholder="NA"
                   class="pi-field"
                   standout dense clearable readonly />
        </o-field>
      </div>
    </div>

    <o-field :label="$t('description')" class="desc">
      <q-input v-model="form.description" placeholder="NA"
               type="textarea"
               class="pi-field max-height"
               maxlength="256" counter
               standout dense clearable readonly />
    </o-field>

    <!-- Category -->
    <o-field-separator :label="$t('book.categoryInfo')"
                       class="q-pb-md" />
    <div class="row col-12 q-col-gutter-md">
      <div class="col-4">
        <o-field label="CLC">
          <q-input v-model="form.clcCode" placeholder="NA"
                   class="pi-field"
                   standout dense clearable readonly />
        </o-field>
      </div>
      <div class="col-4">
        <o-field label="DDC">
          <q-input v-model="form.ddcCode" placeholder="NA"
                   class="pi-field"
                   standout dense clearable readonly />
        </o-field>
      </div>
      <div class="col-4">
        <o-field :label="$t('book.rating')">
          <q-input v-model="form.rating" placeholder="NA"
                   class="pi-field"
                   standout dense clearable readonly />
        </o-field>
      </div>
    </div>
  </o-simple-form>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import OSimpleForm from 'core/page/section/OSimpleForm.vue'
import OFileUploader from 'core/components/fIle/OFileUploader.vue'
import OFieldSeparator from 'core/components/form/field/OFieldSeparator.vue'

import { GET } from 'src/hooks/useRequest'
import useForm from 'src/hooks/useForm'
import useApi from 'src/hooks/useApi'

const apiName = 'book'
const props = defineProps({
  id: {
    type: String,
    default: ''
  },
})
const { form, loading, actions } = useForm()
const { getFileUrl } = useApi()

function load () {
  actions.initForm(apiName)

  if (props.id) {
    GET({name: apiName, query: {id: props.id}}).then(res => {
      form.value = res as Indexable
    })
  }
}

onMounted(load)
</script>

<style lang="scss">
.book-general {
  .pi-field {
    &.q-field--standout.q-field--readonly .q-field__control:before {
      border: unset;
      background: transparent;
    }

    &.q-field--readonly {
      opacity: 0.7;
    }

    .q-icon {
      font-size: 1.2rem;
      cursor: pointer;
    }

  }

  .o-file-uploader {
    .tips {
      text-align: left;
    }

    .q-field__control {
      padding: 0!important;
    }
  }

  .desc {
    margin-top: 0;
  }

  .o-field {
    margin-bottom: 8px;
  }
}
</style>
