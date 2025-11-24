<template>
  <o-common-page class="o-simple-form-page">
    <section class="o-page-wrapper">
      <q-form class="row col-12 o-form" @submit="onSubmit" @reset="onReset">
        <section class="col-12">
          <o-common-card>
            <template #header>
              <div>{{ title }}</div>
            </template>
            <template #right>
            </template>
            <section class="col-12" :class="contentClass">
              <slot></slot>
            </section>
          </o-common-card>
        </section>

        <section class="row col-12 justify-center actions">
          <q-btn type="submit" class="bg-primary text-white" :label="$t('save')" :loading="loading" flat v-if="enableActions" />
          <slot name="actions"></slot>
        </section>
      </q-form>
    </section>

    <!--Controls-->
    <section class="controls full-width">
      <slot name="control"></slot>
    </section>
  </o-common-page>
</template>

<script setup lang="ts">
import OCommonPage from 'core/page/template/OCommonPage.vue';

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '基本信息'
  },
  contentClass: {
    type: String,
    default: 'q-pa-md'
  },
  enableActions: {
    type: Boolean,
    default: false
  },
});
const emit = defineEmits(['submit', 'reset']);
function onSubmit () {
  emit('submit');
}
function onReset () {
  emit('reset');
}
</script>

<style lang="scss">
.o-simple-form-page {

  .panels {
    .o-common-card {
      .card-header {
        height: 40px !important;
        padding: 0 !important;
      }
      .card-content.padding {
        padding: 1rem 0!important;
      }
    }
  }

  .query-condition-card {
    .conditions {
      padding: 16px 0 !important;
    }
    .q-field {
      margin-bottom: 0px;
    }
  }

  .append {
    font-size: 14px;
    padding-left: 16px;
  }

  .q-chip {
    font-size: 11px;
  }

  .actions {
    padding: 1rem 0;

    .q-btn {
      min-width: 120px;
    }
    .q-btn:not(:first-child) {
      margin-left: 8px;
    }
  }

  .controls {
    footer {
      height: 40px;
    }
  }
}
</style>
