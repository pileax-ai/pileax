<template>
  <q-responsive :ratio="3/4">
    <q-card class="book-grid-item" v-ripple>
      <q-img :src="coverUrl" spinner-size="2rem" @error="onError">
        <div class="absolute-top text-subtitle1 tags">
          <template v-for="(item, index) in tags" :key="index">
            <q-chip v-bind="item" square dense />
          </template>
        </div>
        <div class="absolute-bottom text-subtitle1 text-center details">
          <q-btn :label="$t('add')" flat
                 @click.stop="emit('add')" v-if="add && !data.workspaceBookId" />
          <q-btn :label="$t('details')" flat
                 @click.stop="emit('details')" />
        </div>
      </q-img>
      <div class="bookmark" v-if="data.workspaceBookId">
        <q-icon name="o_bookmark" color="amber" size="16px" />
      </div>
    </q-card>

    <slot></slot>
  </q-responsive>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import useBookDetails from 'src/hooks/useBookDetails'
import useApi from 'src/hooks/useApi'

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
})
const emit = defineEmits(['add', 'details'])

const { bookTags } = useBookDetails()
const { getCoverUrl } = useApi()
const coverUrl = ref('')

const tags = computed(() => {
  return bookTags(props.data)
})

function onError(event: any) {
  coverUrl.value = '/images/ui/page/page-bg.svg'
}

onMounted(() => {
  coverUrl.value = getCoverUrl(props.data)
})

</script>

<style lang="scss">
.book-grid-item {
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

  .q-img {
    height: 100%;
  }

  .details {
    padding: 0;
    visibility: hidden;
    opacity: 0;
    transform: translateY(100%);
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out, visibility 0.3s;

    .q-btn {
      height: 48px;
      width: 100%;
    }
  }

  .tags {
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
