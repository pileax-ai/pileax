<template>
  <q-btn class="o-hover-menu-btn"
         :dense="dense"
         :flat="flat"
         round
         @mouseenter="enableHover && (menuOver = true)"
         @mouseleave="enableHover && (menuOver = false)" v-if="round">
    <slot name="icon"></slot>
    <q-icon :name="icon" v-if="icon" />
    <span v-if="label">{{label}}</span>
    <q-menu v-model="menu"
            :anchor="anchor"
            :self="self"
            :offset="offset"
            class="shadow-5"
            :class="menuClass">
      <div :style="{minWidth: minWidth}">
        <q-list no-border link inset-delimiter
                @mouseenter="enableHover && (listOver = true)"
                @mouseleave="enableHover && (listOver = false)">
          <slot></slot>
        </q-list>
      </div>
    </q-menu>
  </q-btn>
  <q-btn class="o-hover-menu-btn"
         :icon-right="iconRight"
         :dense="dense"
         :flat="flat"
         @mouseenter="enableHover && (menuOver = true)"
         @mouseleave="enableHover && (menuOver = false)" v-else>
    <slot name="icon"></slot>
    <q-icon :name="icon" v-if="icon" />
    <span v-if="label">{{label}}</span>
    <q-menu v-model="menu"
            :anchor="anchor"
            :self="self"
            :offset="offset"
            class="shadow-2"
            :class="menuClass">
      <div :style="{minWidth: minWidth}">
        <q-list no-border link inset-delimiter
                @mouseenter="enableHover && (listOver = true)"
                @mouseleave="enableHover && (listOver = false)">
          <slot></slot>
        </q-list>
      </div>
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
import { debounce } from 'quasar';
import {onMounted, ref, watch} from 'vue';

const props = defineProps({
  enableHover: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  iconRight: {
    type: String,
    default: 'mdi-none'
  },
  round: {
    type: Boolean,
    default: false
  },
  flat: {
    type: Boolean,
    default: true
  },
  dense: {
    type: Boolean,
    default: false
  },
  anchor: {
    type: String,
    default: 'bottom right'
  },
  self: {
    type: String,
    default: 'top right'
  },
  offset: {
    type: Array,
    default: function () {
      return [0, 8]
    }
  },
  minWidth: {
    type: String,
    default: '160px'
  },
  menuClass: {
    type: String,
    default: ''
  }
});

const menu = ref(false);
const menuOver = ref(false);
const listOver = ref(false);

function toggleMenu() {
  menu.value = menuOver.value || listOver.value;
}

watch(menuOver, () => {
  toggleMenu();
})

watch(listOver, () => {
  toggleMenu();
})

onMounted(() => {
  toggleMenu = debounce(toggleMenu, 200); // todo: Cannot assign to because it is a function.
});
</script>

<style lang="scss">
.o-hover-menu-btn {
  .q-btn__content {
    span {
      margin: 0 4px;
    }
  }
  .mdi-none {
    display: none;
  }
}
</style>
