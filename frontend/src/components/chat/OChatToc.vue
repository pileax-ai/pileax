<template>
  <o-hover-menu class="o-chat-toc"
                menu-class="o-chat-toc-menu"
                anchor="top end"
                self="top right" min-width="240px">
    <template #trigger>
      <div class="mini-view" v-if="miniView">
        <ul class="toc__list">
          <template v-for="(item, index) in chats" :key="index">
            <li class="toc__item"
                :class="[
                  selectedId === item.id ? 'selected' : '',
                  `toc__item--${item.favorite}`,
                ]">
            </li>
          </template>
        </ul>
      </div>
      <slot name="trigger" />
    </template>

    <div class="main-view o-scroll">
      <div class="toc__title">{{ $t('toc') }}</div>
      <ul class="toc__list">
        <li
          class="toc__item ellipsis"
          :class="`toc__item--${item.favorite}`"
          v-for="(item, index) in chats"
          :key="index"
        >
            <span class="heading"
                  :class="{ selected: selectedId === item.id }"
                  v-close-popup
                  @click="onClick((item))">
              {{ item.message }}
            </span>
        </li>
      </ul>
    </div>
  </o-hover-menu>
</template>

<script setup lang="ts">
import type { PropType} from 'vue'
import { computed, ref } from 'vue'
import OHoverMenu from 'core/components/menu/OHoverMenu.vue'

const props = defineProps({
  chats: {
    type: Array as PropType<Indexable[]>,
    required: true
  },
  miniView: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['action'])
const selectedId = ref('')

function onScroll(event?: Event) {
  for (const item of props.chats) {
    const element = document.querySelector(`[id="${item.id}"]`)
    if (!element) continue

    const rect = element.getBoundingClientRect()
    if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
      selectedId.value = item.id
      break
    }
  }
}

function onClick(item: Indexable) {
  selectedId.value = item.id
  const element = document.querySelector(`[id="${item.id}"]`) as HTMLElement
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
  }
}

defineExpose({
  onScroll,
})
</script>

<style lang="scss">
.o-chat-toc {
  .mini-view {
    border-radius: 4px;
    padding: 6px;
    //background: var(--q-accent);

    .toc__item {
      background: var(--yii-caption-color);
      display: block;
      height: 3px;
      width: 20px;
      padding: 0;
      margin-bottom: 8px;
      border-radius: 1px;

      &--1 {
        height: 6px;
      }

      &.selected {
        background: var(--yii-color-accent);
      }
    }
  }

}

.o-chat-toc-menu {
  .main-view {
    padding: 8px;
  }
  .toc__list {
    list-style: none;
    margin: 0;
    padding: 0;
    padding-inline-start: 0 !important;
    margin-block-start: 0 !important;
    margin-block-end: 0 !important;
  }
  .toc__item {
    max-width: 300px;
    font-size: 0.9rem;
    padding: 4px 4px;
    margin: 4px 0;
    .heading {
      color: var(--q-info) !important;

      &:hover {
        color: var(--q-primary) !important;
        text-decoration: none !important;
        cursor: pointer;
      }

      &.selected {
        color: var(--q-primary) !important;
      }
    }
    &--1 {
      font-weight: 800;
      background: var(--q-dark);
      border-radius: 4px;
    }
  }
}
</style>
