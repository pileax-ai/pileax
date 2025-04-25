<template>
  <q-item class="o-common-item"
          :class="{'dense': dense, 'round': round}"
          :to="to"
          :clickable="clickable"
          v-close-popup="closable" exact>
    <q-item-section avatar v-if="emoji || icon">
      <q-avatar :size="size" :textColor="color" class="themed" :class="iconClass">
        <o-icon :name="icon" :emoji="emoji" />
      </q-avatar>
    </q-item-section>
    <q-item-section>
      <q-item-label class="row items-center ellipsis" lines="1">
        <span v-html="label"></span>
        <slot name="label"></slot>
        <q-icon name="help" class="q-ml-xs" v-if="help">
          <o-tooltip position="top">{{ help }}</o-tooltip>
        </q-icon>
      </q-item-label>
      <q-item-label caption v-if="sublabel">{{sublabel}}</q-item-label>
    </q-item-section>
    <q-item-section side v-if="sideIcon">
      <q-avatar :size="size" :icon="sideIcon" />
    </q-item-section>
    <q-item-section class="side-label" side v-if="sideLabel || rightSide">
      <q-item-label>{{sideLabel}}</q-item-label>
      <q-item-label caption v-if="sideSublabel">{{sideSublabel}}</q-item-label>
      <slot name="side"></slot>
    </q-item-section>

    <slot></slot>
  </q-item>
</template>

<script setup lang="ts">

import {computed} from 'vue';

const props = defineProps({
  clickable: {
    type: Boolean,
    default: false
  },
  closable: {
    type: Boolean,
    default: false
  },
  dense: {
    type: Boolean,
    default: false
  },
  round: {
    type: Boolean,
    default: false
  },
  id: {
    type: String,
    default: ''
  },
  to: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: '3rem'
  },
  color: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  iconClass: {
    type: String,
    default: ''
  },
  emoji: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: 'Label'
  },
  sublabel: {
    type: String,
    default: ''
  },
  help: {
    type: String,
    default: ''
  },
  sideIcon: {
    type: String,
    default: ''
  },
  sideLabel: {
    type: String,
    default: ''
  },
  sideSublabel: {
    type: String,
    default: ''
  },
  rightSide: {
    type: Boolean,
    default: false
  }
});
</script>

<style lang="scss">
.o-common-item {
  padding: 0;
  .q-item__section--avatar {
    min-width: unset;

    svg {
      width: 1.5rem;
      height: 1.5rem;
    }
  }

 .q-item__section--side {
   font-size: 0.8rem;
   padding-right: 0px;
 }

  &.padding {
    padding: 0 1rem;
  }

  &.active {
    background: var(--q-accent);
  }

  &.round {
    border-radius: 4px;
  }
}

.o-common-item.dense {
  min-height: unset;

  .q-avatar {
    font-size: 2.4rem !important;
  }
}
</style>
