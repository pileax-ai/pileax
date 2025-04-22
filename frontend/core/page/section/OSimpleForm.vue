<template>
  <section class="o-simple-form">
    <section class="o-page-wrapper">
      <q-form class="row col-12 o-form"
              @submit="onSubmit"
              @reset="onReset">
        <section class="col-12">
          <o-common-card header>
            <template #header>
              <div>{{ title }}</div>
            </template>
            <template #right>
            </template>
            <section class="col-12">
              <slot></slot>
            </section>
          </o-common-card>
        </section>

        <section class="row col-12 justify-center full-width actions"
                 v-if="enableActions">
          <q-btn type="submit"
                 class="bg-primary text-white"
                 :label="$t('save')"
                 :loading="loading"
                 flat />
        </section>
      </q-form>
    </section>
  </section>
</template>

<script setup lang="ts">
defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
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
.o-simple-form {
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
    margin: 1rem 0 1.5rem 0;

    .q-btn {
      min-width: 120px;
    }
  }
}
</style>
