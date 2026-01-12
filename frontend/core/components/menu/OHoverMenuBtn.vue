<template>
  <q-btn class="o-hover-menu-btn"
         @mouseenter="enableHover && (menuOver = true)"
         @mouseleave="enableHover && (menuOver = false)">
    <slot name="icon"></slot>
    <q-icon :name="icon" v-if="icon" />
    <span v-if="label">{{label}}</span>
    <q-icon :name="iconRight" class="text-tips" v-if="iconRight" />
    <q-icon :name="menu ? 'mdi-chevron-up' : 'mdi-chevron-down'"
            class="text-tips" v-if="dropdown" />

    <q-menu v-model="menu"
            :anchor="anchor"
            :self="self"
            :offset="offset"
            :persistent="persistent"
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
import { debounce } from 'quasar'
import type { PropType} from 'vue'
import { onActivated, onDeactivated, onMounted, ref, watch } from 'vue'

const props = defineProps({
  enableHover: {
    type: Boolean,
    default: false
  },
  defaultOpen: {
    type: Boolean,
    default: false
  },
  persistent: {
    type: Boolean,
    default: false
  },
  dropdown: {
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
  anchor: {
    type: String as PropType<PositionType>,
    default: 'bottom right'
  },
  self: {
    type: String as PropType<PositionType>,
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
    default: 'pi-menu'
  }
})

const menu = ref(false)
const menuOver = ref(false)
const listOver = ref(false)

const toggleMenu = debounce(() => {
  menu.value = menuOver.value || listOver.value
}, 200)

watch(menuOver, () => {
  toggleMenu()
})

watch(listOver, () => {
  toggleMenu()
})

onMounted(() => {
  menu.value = props.defaultOpen
})

onActivated(() => {
  menu.value = props.defaultOpen
})

onDeactivated(() => {
  menu.value = false
})
</script>

<style lang="scss">
.o-hover-menu-btn {
  .q-btn__content {
    span {
      margin: 0 4px;
    }
  }
  .q-icon {
    font-size: 1.4rem;
  }
  .mdi-none {
    display: none;
  }
}
</style>
