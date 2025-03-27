<template>
  <q-dialog ref="modal"
            :maximized="maximized"
            :no-backdrop-dismiss="noDismiss"
            :position="position"
            @show="$emit('open')"
            @hide="$emit('close')"
            class="o-common-dialog">
    <q-card class="dialog-card" :class="contentClass" :style="contentStyle">
      <q-bar class="bg-transparent text-readable" v-if="header">
        <q-icon class="title-icon" :name="icon" v-if="icon" />
        <div class="title" v-if="icon">{{title}}</div>

        <q-space />

        <q-btn icon="close"
               v-close-popup dense round flat
               v-if="!noDismiss" />
      </q-bar>

      <q-card-section class="dialog-content">
        <slot></slot>
      </q-card-section>

      <q-card-actions class="dialog-actions"
                      align="around"
                      v-if="showCancel || showOk">
        <q-btn class="col-5 bg-accent text-readable"
               v-close-popup rounded flat
               v-if="showCancel">
          {{$t('cancel')}}
        </q-btn>
        <q-btn class="col-5 bg-primary text-white"
               :loading="okLoading"
               @click="$emit('ok')"
               rounded flat
               v-if="showOk">
          {{ok || $t('ok')}}
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  position: {
    type: String,
    default: 'standard'
  },
  maximized: {
    type: Boolean,
    default: false
  },
  noDismiss: {
    type: Boolean,
    default: false
  },
  header: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  contentClass: {
    type: String,
    default: ''
  },
  contentStyle: {
    type: Object,
    default: function () {
      return { minWidth: '400px', maxWidth: '400px', padding: '12px' }
    }
  },
  showCancel: {
    type: Boolean,
    default: false
  },
  showOk: {
    type: Boolean,
    default: false
  },
  ok: {
    type: String,
    default: ''
  },
  okLoading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['ok', 'close', 'show']);

const modal = ref();

watch(() => props.show, (newValue) => {
  if (newValue) {
    modal.value.show();
  } else {
    modal.value.hide();
  }
})

onMounted(() => {
  if (props.show) {
    modal.value.show();
  }
})
</script>

<style lang="scss">
.o-common-dialog {
  .dialog-content {
    padding: 16px 16px;
    min-height: unset!important;
    word-break: break-all;
  }

  .content-scroll-area {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
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

  .dialog-actions {
    //background: red;
    height: 60px;
  }
}

.mobile {
  .o-common-dialog {
    .q-bar {
      .title-icon {
        font-size: 1.4rem !important;
      }
      .title {
        font-size: 1.2rem;
      }
    }
  }
}
</style>
