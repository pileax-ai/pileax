<template>
  <q-btn class="o-menu-btn"
         @mouseenter="enableHover && (menuOver = true)"
         @mouseleave="enableHover && (menuOver = false)">
    <slot name="icon"></slot>
    <q-icon :name="icon" v-if="icon" />
    <div class="row items-center label" v-if="!iconOnly">
      <span v-if="label">{{label}}</span>
      <slot name="label"></slot>
    </div>

    <slot></slot>

    <q-icon :name="iconRight" class="text-tips" v-if="iconRight" />
    <q-icon :name="menu ? 'mdi-chevron-up' : 'mdi-chevron-down'"
            class="text-tips" v-if="dropdown" />

    <q-menu v-model="menu"
            :anchor="anchor"
            :self="self"
            :offset="offset"
            :class="menuClass"
            @before-show="onBeforeShow"
            @before-hide="menu = false">
      <div :style="{minWidth: minWidth, maxHeight: maxHeight}">
        <q-list no-border link inset-delimiter
                @mouseenter="enableHover && (listOver = true)"
                @mouseleave="enableHover && (listOver = false)">
          <slot name="menu"></slot>
        </q-list>
      </div>
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
import { onActivated, onDeactivated, onMounted, PropType, ref, watch } from 'vue'
import { debounce } from 'quasar'

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
  icon: {
    type: String,
    default: ''
  },
  iconRight: {
    type: String,
    default: ''
  },
  iconOnly: {
    type: Boolean,
    required: false
  },
  label: {
    type: String,
    default: ''
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
  maxHeight: {
    type: String,
    default: '60vh'
  },
  menuClass: {
    type: String,
    default: 'pi-menu'
  }
});
const emit = defineEmits(['before-show']);

const menu = ref(false);
const menuOver = ref(false);
const listOver = ref(false);

const onBeforeShow = () => {
  menu.value = true
  emit('before-show')
}

const toggleMenu = debounce(() => {
  menu.value = menuOver.value || listOver.value;
}, 200)

watch(menuOver, () => {
  toggleMenu();
})

watch(listOver, () => {
  toggleMenu();
})

onMounted(() => {
  menu.value = props.defaultOpen;
})

onActivated(() => {
  menu.value = props.defaultOpen;
});

onDeactivated(() => {
  menu.value = false;
})
</script>

<style lang="scss">
.o-menu-btn {
  .q-btn__content {
    .label {
      margin: 0 4px;
    }
  }
  .q-icon {
    font-size: 1.4rem;
  }
  svg {
    height: 1.2rem;
    width: 1.2rem;
  }
}
</style>
