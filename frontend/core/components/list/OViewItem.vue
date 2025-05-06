<template>
  <q-item class="o-view-item" :class="{'dense': dense}" :clickable="clickable">
    <q-item-section avatar>
      <section class="row items-center text-tips">
        <div class="row items-center q-px-xs" v-if="icon">
          <o-icon :name="icon" size="1.2rem" />
        </div>
        <div class="text-tips labels">{{label}}</div>
      </section>
    </q-item-section>
    <q-item-section :align="align">
      <q-item-label :lines="lines">
        <slot name="value"></slot>
        <a :href="linkUrl" target="_blank" v-if="link">
          <span>{{value}}</span>
          <q-icon name="open_in_new" class="q-ml-xs" />
        </a>
        <span v-else>{{value}}</span>
        <o-tooltip max-width="400px" v-if="showTooltip">
          {{value}}
        </o-tooltip>
      </q-item-label>
      <slot></slot>
    </q-item-section>
    <q-item-section side v-if="rightSide || copiable || arrow">
      <div class="row items-center">
        <q-btn icon="open_in_new" flat round v-if="link">
          <q-tooltip class="bg-primary text-white">
            Open in new tab
          </q-tooltip>
        </q-btn>
        <o-copy-btn :value="value" flat round v-if="copiable" />
        <slot name="side"></slot>

        <q-icon name="chevron_right" class="text-tips" v-if="arrow" />
      </div>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import OIcon from 'core/components/icon/OIcon.vue';
import OCopyBtn from 'core/components/button/OCopyBtn.vue';

const props = defineProps({
  icon: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  value: {
  },
  align: {
    type: String,
    default: 'left'
  },
  lines: {
    type: String,
    default: '1'
  },
  dense: {
    type: Boolean,
    default: true
  },
  clickable: {
    type: Boolean,
    default: false
  },
  showTooltip: {
    type: Boolean,
    default: false
  },
  link: {
    type: String,
    default: ''
  },
  copiable: {
    type: Boolean,
    default: false
  },
  rightSide: {
    type: Boolean,
    default: false
  },
  arrow: {
    type: Boolean,
    default: false
  }
});

const collapse = computed(() => {
  return props.value?.length > 50;
});

const linkUrl = computed(() => {
  return props.link.indexOf('http') === 0 ? props.link : 'https://' + props.link;
});
</script>

<style lang="scss">
.o-view-item {
  min-height: 36px;
  padding: 0;
  border-radius: 4px;

  .q-item__section--avatar {
    min-width: 120px;
  }
  svg {
    width: 1.2rem;
    height: 1.2rem;
  }

 .q-item__section--side {
   padding-right: 0;
   .q-icon {
     font-size: 1rem;
   }
 }
 .q-item__label {
   word-wrap: break-word;
 }

  &.dense {
    min-height: 36px;

    .q-btn--round {
      min-width: 2rem;
      min-height: 2rem;
    }
  }
}
</style>
