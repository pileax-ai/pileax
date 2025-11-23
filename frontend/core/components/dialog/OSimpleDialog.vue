<template>
  <q-dialog ref="dialogRef"
            class="o-simple-dialog"
            @hide="onHide"
            @show="onShow">
    <q-card class="dialog-card" :style="dialogStyle">
      <q-bar class="bg-transparent text-readable">
        <q-icon class="title-icon" :name="icon" v-if="icon" />
        <div class="title">{{ title }}</div>
        <q-space />
        <q-btn icon="close" dense round flat @click="onHide" />
      </q-bar>

      <q-card-section class="dialog-content">
        <slot></slot>

        <q-inner-loading :showing="loading">
          <q-spinner-gears size="100px" color="primary" />
        </q-inner-loading>
      </q-card-section>

      <q-card-actions class="dialog-actions"
                      align="right" v-if="showActions">
        <q-btn class="bg-accent text-readable"
               v-close-popup flat>
          {{$t('cancel')}}
        </q-btn>
        <q-btn class="bg-primary text-white"
               :loading="loading"
               @click="onOk"
               flat>
          {{$t('ok')}}
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { QDialog } from 'quasar'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  dialogStyle: {
    type: Object,
    default: function () {
      return { minWidth: '480px', maxWidth: '800px', padding: '0px' }
    }
  },
  loading: {
    type: Boolean,
    default: false
  },
  showActions: {
    type: Boolean,
    default: false
  },
})
const emit = defineEmits(['ok', 'show', 'update:modelValue']);

const dialogRef = ref<InstanceType<typeof QDialog>>();

const onHide = () => {
  emit('update:modelValue', false);
}

const onShow = () => {
  emit('show')
}

const onOk = () => {
  emit('ok')
}

watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    dialogRef.value?.show();
  } else {
    dialogRef.value?.hide();
  }
})
</script>

<style lang="scss">
.o-simple-dialog {
  .dialog-content {
    padding: 16px 16px;
    min-height: unset!important;
    word-break: break-all;

    .content {
      font-size: 1.1rem;
    }

    .q-field__prefix {
      opacity: 0.5;
      padding-right: 10px;
    }
  }


  .q-bar {
    height: 40px;
    margin-top: 4px;

    .title-icon {
      font-size: 1.8rem !important;
    }
    .title {
      font-size: 1.2rem;
    }
  }
}
</style>
