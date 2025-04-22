<template>
  <section class="o-common-section">
    <q-scroll-area ref="scroll"
                   class="o-scroll-wrapper"
                   v-if="scrollable">
      <slot></slot>
    </q-scroll-area>
    <template v-else>
      <slot></slot>
    </template>

    <!--Side Dialog-->
    <section>
      <o-side-dialog v-bind="side"
                     :seamless="false"
                     scrollable
                     @show="onSideShow"
                     @close="onSideClose"
                     @confirm="onSideConfirm">
        <template #content>
          <slot name="side-panel"></slot>
        </template>
      </o-side-dialog>
    </section>
  </section>
</template>

<script setup lang="ts">
import OSideDialog from 'core/components/dialog/OSideDialog.vue';

const props = defineProps({
  scrollable: {
    type: Boolean,
    default: false
  },
  side: {
    type: Object,
    default: function () {
      return {
        show: false,
        title: '',
        style: {width: '375px'},
        action: false
      }
    }
  },
  sideFullScreen: {
    type: Boolean,
    default: false
  },
});
const emit = defineEmits(['update:side', 'sideClose', 'sideConfirm']);

function onSideShow () {
  let side = props.side;
  side.show = true;
  emit('update:side', side);
}

function onSideClose () {
  let side = props.side;
  side.show = false;
  emit('update:side', side);
  emit('sideClose');
}

function onSideConfirm () {
  emit('sideConfirm')
}
</script>

<style lang="scss">
.o-common-section {
}
</style>
