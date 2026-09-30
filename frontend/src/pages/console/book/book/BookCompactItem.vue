<template>
  <q-responsive :ratio="2/1">
    <q-card class="book-compact-item">
      <q-item>
        <q-item-section avatar>
          <q-img :src="coverUrl" :ratio="3/4" spinner-size="20px" @error="onError" />
        </q-item-section>
        <q-item-section class="justify-around">
          <q-item-label class="title text-bold" lines="2">
            {{ data.title }}
          </q-item-label>
          <q-item-label caption lines="1">
            {{ data.author }}
          </q-item-label>
        </q-item-section>
        <div class="absolute-top tags" v-if="!add">
          <template v-for="(item, index) in tags" :key="index">
            <q-chip v-bind="item" square dense />
          </template>
        </div>
        <div class="row justify-end items-end absolute-bottom text-center details"
             :class="{ 'selectable': selectable }">
          <template v-if="add">
            <q-btn :label="$t('add')" flat
                   @click.stop="emit('add')" v-if="!data.workspaceBookId" />
            <q-btn :label="$t('details')" flat
                   @click.stop="onDetails" />
          </template>
          <q-btn flat
                 @click.stop="onDetails"
                 v-else>
            <div class="row col-12 justify-between">
              <q-checkbox v-model="selected"
                          dark
                          @update:modelValue="onSelect"
                          v-if="selectable" />
              <template v-else>
                <div>
                  {{ $t('details') }}
                </div>
                <div>
                  {{ formatNumber(data.readingPercentage * 100, { decision: 0 }) }}%
                </div>
              </template>
            </div>
          </q-btn>
        </div>
      </q-item>
      <div class="bookmark" v-if="data.workspaceBookId">
        <q-icon name="o_bookmark" color="amber" size="16px" />
      </div>
    </q-card>
    <slot></slot>
  </q-responsive>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import useApi from 'src/hooks/useApi'
import useBookDetails from 'src/hooks/useBookDetails'
import { formatNumber } from 'core/utils/format'

const props = defineProps({
  data: {
    type: Object,
    default: function () {
      return {}
    }
  },
  add: {
    type: Boolean,
    default: false
  },
  selectable: {
    type: Boolean,
    default: false
  },
})
const emit = defineEmits(['add', 'details', 'selected'])

const { bookTags } = useBookDetails()
const { getCoverUrl } = useApi()
const coverUrl = ref('')
const selected = ref(false)

const tags = computed(() => {
  return bookTags(props.data)
})

function onSelect(val: boolean) {
  emit('selected', val)
}

function onDetails() {
  if (props.selectable) {
    selected.value = !selected.value
    emit('selected', selected.value)
  } else {
    emit('details')
  }
}

function onError(event: any) {
  coverUrl.value = '/images/ui/page/page-bg.svg'
}

watch(() => props.selectable, () => {
  selected.value = false
})

onMounted(() => {
  coverUrl.value = getCoverUrl(props.data)
})

</script>

<style lang="scss">
.book-compact-item {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;

  .bookmark {
    position: absolute;
    top: -10px;
    right: 8px;
    z-index: 1;
  }

  .q-item {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    padding: 8px;
    overflow: hidden;
  }

  .q-item__section--avatar {
    min-width: 64px;
    padding-right: 8px;
  }

  .q-img {
    border-radius: 2px;
  }

  .details {
    color: #ffffff;
    background: rgba(0,0,0,0.5);
    padding: 0;
    visibility: hidden;
    opacity: 0;
    transform: translateY(100%);
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out, visibility 0.3s;

    &.selectable {
      visibility: visible;
      opacity: 1;
      transform: translateY(0);

      .q-btn {
        padding: 4px;
      }
    }

    .q-btn {
      height: 48px;
      width: 100%;
    }
  }

  .tags {
    color: #ffffff;
    background: rgba(0,0,0,0.5);
    padding: 4px 4px;
    visibility: hidden;
    opacity: 0;
    transform: translateY(-100%);
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out, visibility 0.3s;

    .q-chip {
      background: rgba(0,0,0,0.1);
      color: #ffffff;
      font-size: 0.8rem;
    }
  }

  &:hover {
    .details {
      visibility: visible;
      opacity: 1;
      transform: translateY(0);
    }

    .tags {
      visibility: visible;
      opacity: 1;
      transform: translateY(0);
    }
  }
}
</style>
