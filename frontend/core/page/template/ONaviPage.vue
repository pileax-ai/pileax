<template>
  <o-common-page class="o-navi-page">
    <o-common-card class="col-12">
      <template #header>
        <div>{{ title }}</div>
      </template>
      <template #right>
      </template>
      <section class="col-12 q-pa-md" :class="contentClass">
        <slot></slot>
      </section>
    </o-common-card>

    <!--Controls-->
    <div class="row justify-center items-center navi previous" :class="{'tips': showTips}">
      <q-btn icon="navigate_before" class="handler" flat @click="onPrevious" :disable="indexAlt === 0" />
    </div>
    <div class="row justify-center items-center navi next" :class="{'tips': showTips}">
      <q-btn icon="navigate_next" class="handler" flat @click="onNext" :disable="indexAlt >= total - 1" />
    </div>
  </o-common-page>
</template>

<script setup lang="ts">
import {computed, onActivated, onMounted, onUnmounted, ref, watch} from 'vue'

import OCommonPage from 'core/page/template/OCommonPage.vue'

const props = defineProps({
  index: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  },
  contentClass: {
    type: String,
    default: ''
  },
})
const emit = defineEmits(['previous', 'next'])
const indexAlt = ref(0)
const showTips = ref(true)

function onPrevious () {
  const i = indexAlt.value - 1
  if (i >= 0) {
    indexAlt.value = i
    emit('previous', i)
  }
}
function onNext () {
  const i = indexAlt.value + 1
  if (i < props.total) {
    indexAlt.value = i
    emit('next', i)
  }
}

function onKeyup(event) {
  switch (event.key) {
    case 'ArrowUp':
    case 'ArrowLeft':
      onPrevious()
      break
    case 'ArrowDown':
    case 'ArrowRight':
      onNext()
      break
  }
}

onMounted(() => {
  indexAlt.value = props.index
  setTimeout(() =>  {
    showTips.value = false
  }, 1000)

  window.addEventListener('keyup', onKeyup)
})

onUnmounted(() => {
  window.removeEventListener('keyup', onKeyup)
})
</script>

<style lang="scss">
.o-navi-page {
  .o-page-container {
    background: var(--q-secondary) !important;
  }
  .navi {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100px;
    text-align: center;

    .handler {
      width: 60px;
      height: 120px;
      line-height: 100px;
      background: var(--q-accent);
      cursor: pointer;
      visibility: hidden;

      .q-icon {
        font-size: 3rem;
      }
    }

    &:hover, &.tips {
      .handler {
        visibility: visible;
      }
    }

    &.previous {
      left: 0;
    }

    &.next {
      right: 0;
    }
  }
}
</style>
