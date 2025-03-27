<template>
  <q-card class="o-common-card"
          :class="{'dense': dense, 'small': small, 'flat': flat, 'tabs-card': tabs, 'bg-accent': accent }"
          :flat="flat || !shadow">
    <q-card-section class="row justify-between items-center card-header"
                    :class="`${headerClass}`"
                    v-if="header">
      <div class="row items-center title">
        <q-icon :name="icon" v-if="icon" /> {{title}}
        <slot name="header"></slot>
      </div>
      <div class="row items-center card-header-right">
        <slot name="right"></slot>
        <q-btn :icon="expand ? 'keyboard_arrow_up' : 'keyboard_arrow_down'" flat round @click="toggleExpand" v-if="expandable">
          <o-tooltip :message="expand ? $t('collapse') : $t('expand')" />
        </q-btn>
      </div>
    </q-card-section>

    <q-separator :class="separatorClass" v-if="header && expand" />

    <q-card-section class="row col-12 card-content" :class="{'padding': padding}" v-if="expand">
      <section class="col-12" :class="`${contentClass}`">
        <slot></slot>
      </section>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const props = defineProps({
  icon: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  flat: {
    type: Boolean,
    default: false
  },
  accent: {
    type: Boolean,
    default: false
  },
  shadow: {
    type: Boolean,
    default: false
  },
  contentClass: {
    type: String,
    default: ''
  },
  separatorClass: {
    type: String,
    default: 'bg-accent'
  },
  header: {
    type: Boolean,
    default: false
  },
  headerClass: {
    type: String,
    default: 'test-info'
  },
  dense: {
    type: Boolean,
    default: false
  },
  small: {
    type: Boolean,
    default: false
  },
  padding: {
    type: Boolean,
    default: false
  },
  expandable: {
    type: Boolean,
    default: false
  },
  tabs: {
    type: Boolean,
    default: false
  },
});

const expand = ref(true);

function toggleExpand() {
  expand.value = !expand.value;
}
</script>

<style lang="scss">
.o-common-card {
  padding: 0;
  border-radius: 4px;
  overflow: hidden;

  &.tabs-card {
    .q-tab {
      height: 56px;
    }
  }

  .card-header {
    padding: 0 16px;
    height: 56px;

    .q-icon {
      font-size: 1.6rem;
    }

    .q-chip {
      .q-icon {
        font-size: 1rem!important;
      }
    }

    .title {
      font-size: 1.2rem;
      font-weight: bold;

      .q-icon {
        padding-right: 8px;
      }
    }

    .card-header-right {
      .q-btn {
        min-width: unset;
        padding: 4px 12px;

        .q-icon {
          //font-size: 1.2rem;
          font-weight: 200;
        }

        svg {
          width: 1.2rem;
          height: 1.2rem;
        }

        &:not(:first-child) {
          margin-left: 14px;
        }
      }
      .q-btn--round {
        width: 3rem;
        height: 3rem;
      }
      .q-chip span {
        font-size: 0.8rem;
      }
    }
  }

  .card-content {
    padding: 0;

    .q-tabs.header {
      padding: 0!important;

      .q-tab__label {
        font-size: 1.1rem;
        font-weight: 600;
      }
    }

    &.padding {
      padding: 21px
    }
  }
}

.o-common-card.dense {
  .card-header {
    padding: 0px;
    height: 42px;
  }
}

.o-common-card.flat {
  .card-header {
    padding: 0px;
  }
}

.o-common-card.small {
  width: 800px !important;
}

.o-common-card:not(:first-child) {
  margin-top: 21px;
}
</style>
