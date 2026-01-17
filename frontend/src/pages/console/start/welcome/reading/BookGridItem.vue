<template>
  <q-card class="book-grid-item"
          @click="onOpen"
          v-ripple>
    <q-img :src="data.id ? coverUrl : $public('/images/book/dark-bubble_nebula.jpg')">
      <div class="absolute-bottom text-subtitle1 text-center details">
        <div class="q-py-md">
          <template v-if="data.id">
            <q-icon name="o_timer" class="q-mr-xs" />
            {{ timeMulti(data.updateTime, 'YYYY/MM/DD').fromNow() }}
          </template>
          <template v-else>
            {{ $t('book.add') }}
          </template>
        </div>
      </div>
    </q-img>

    <o-tooltip v-if="false">
      {{ data.title }}
    </o-tooltip>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { router } from 'src/router'
import useApi from 'src/hooks/useApi'
import useReading from 'src/hooks/useReading'
import { timeMulti } from 'core/utils/dayjs'

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

const { getCoverUrl } = useApi()
const { openBook } = useReading()
const coverUrl = ref('')

const onOpen = () => {
  if (props.data.id) {
    openBook(props.data)
  } else {
    router.push({ name: 'book-library' })
  }
}

onMounted(() => {
  coverUrl.value = getCoverUrl(props.data)
})

</script>

<style lang="scss">
.book-grid-item {
  width: 100%;
  height: 100%;
  cursor: pointer;

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

  &:hover {
    .details {
      visibility: visible;
      opacity: 1;
      transform: translateY(0);
    }
  }
}
</style>
