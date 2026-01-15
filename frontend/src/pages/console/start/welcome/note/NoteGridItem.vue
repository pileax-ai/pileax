<template>
  <q-card class="note-grid-item"
          @click.stop.prevent="onOpen"
          v-ripple>
    <header class="bg-accent">
      <img :src="data.cover" alt="" v-if="data.cover" />
    </header>
    <section class="content">
      <div class="note-icon">
        <o-icon :name="data.icon || NoteDefaultIcon" />
      </div>
      <div class="note-content q-py-sm ellipsis">
        {{ data.title }}
      </div>
    </section>
    <q-separator class="bg-accent" />
    <footer class="row items-center q-px-md">
      <q-icon name="o_timer" class="q-mr-xs" />
      {{ timeMulti(data.updateTime, 'YYYY/MM/DD').timestamp() }}
    </footer>
  </q-card>
</template>

<script setup lang="ts">
import { NoteDefaultIcon } from 'core/constants/constant'
import { timeMulti } from 'core/utils/dayjs'
import useNote from 'src/hooks/useNote'

const props = defineProps({
  data: {
    type: Object,
    default: function () {
      return {}
    }
  },
})

const { addNote, openNote } = useNote()

const onOpen = () => {
  if (props.data.id) {
    openNote(props.data)
  } else {
    addNote()
  }
}
</script>

<style lang="scss">
.note-grid-item {
  width: 100%;
  height: 100%;
  cursor: pointer;

  header {
    height: 33%;
    border-radius: 1rem 1rem 0 0;

    img {
      display: block;
      object-fit: cover;
      width: 100%;
      height: 100%;
      border-radius: 1rem 1rem 0 0;
    }
  }

  .content {
    position: relative;
    height: 47%;
    padding: 0 1rem;
    text-align: left;
    font-weight: 600;

    .note-icon {
      position: absolute;
      top: -20px;
      .o-icon {
        font-size: 30px;
      }
    }

    .note-content {
      padding-top: 30px;
    }
  }

  footer {
    height: 20%;
  }

}
</style>
