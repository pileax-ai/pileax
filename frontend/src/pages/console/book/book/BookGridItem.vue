<template>
  <q-responsive :ratio="3/4">
    <q-card class="book-grid-item" v-ripple>
      <q-img :src="coverUrl">
        <div class="absolute-bottom text-subtitle1 text-center details">
          <q-btn label="添加" flat @click.stop="emit('add')" v-if="add" />
          <q-btn label="详情" flat @click.stop="emit('details')" />
        </div>
      </q-img>
    </q-card>
  </q-responsive>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue';
import useApi from 'src/hooks/useApi';

const props = defineProps({
  data: {
    type: Object,
    default: function () {
      return {};
    }
  },
  add: {
    type: Boolean,
    default: false
  },
});
const emit = defineEmits(['add', 'details']);

const { getCoverUrl } = useApi();
const coverUrl = computed(() => {
  return getCoverUrl(props.data);
})

onMounted(() => {
  // getCover();
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
