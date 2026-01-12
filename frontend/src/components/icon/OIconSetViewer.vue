<template>
  <section class="o-icon-set-viewer">
    <header class="row justify-between items-center search">
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-input v-model="term" placeholder="Search icons" debounce="200" outlined rounded>
          <template #prepend>
            <q-icon name="search" />
          </template>
          <template v-slot:append>
            <q-icon name="close" @click="term = ''" class="cursor-pointer" v-if="term" />
          </template>
        </q-input>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12 text-right desktop-only name">
        {{ title }}
      </div>
    </header>

    <section class="row icons" :class="isMobile ? 'justify-around' : 'justify-start'">
      <q-btn v-for="(item, index) in iconList" :key="index"
             class="text-readable"
             flat
             @click="onClick(item.name)">
        <q-icon :name="item.name" size="2.4rem" />
        <o-tooltip>{{item.name}}</o-tooltip>
      </q-btn>
    </section>

    <footer class="row col-12 justify-between items-center pagination">
      <section class="desktop-only">
        <q-chip class="bg-accent" square>
          <q-avatar color="primary" text-color="white" style="width: 50px;">Total</q-avatar>
          {{icons.length}}
        </q-chip>
      </section>
      <q-pagination v-model="index"
                    :max="max"
                    :max-pages="isMobile ? 3 : 6"
                    direction-links
                    :boundary-links="!isMobile"
                    flat
                    color="info"
                    active-color="primary"
                    active-design="unelevated"
                    gutter="10px"
                    class="pi-pagination" />
    </footer>
  </section>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {isMobile} from 'core/hooks/useCommon'
import MaterialIcons from 'src/assets/icon-set/material-icons'
import MdiV6 from 'src/assets/icon-set/mdi-v6'

const props = defineProps({
  name: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
})

const term = ref('')
const iconSetName = ref('')
const allIcons = ref([])
const index = ref(1)
const size = ref(200)

const icons = computed(() => {
  if (term.value) {
    return allIcons.value.filter(e => e.name.indexOf(term.value) >= 0)
  } else {
    return allIcons.value
  }
})

const iconList = computed(() => {
  const start = (index.value - 1) * size.value
  const end = index.value * size.value
  return icons.value.slice(start, end)
})

const max = computed(() => {
  const total = icons.value.length
  let max = parseInt(total / size.value)
  if (total % size.value !== 0) {
    max += 1
  }
  return max
})

function loadIcon () {
  switch (iconSetName.value) {
    case 'material-icons':
      allIcons.value = MaterialIcons.icons
      break
    case 'mdi-v6':
      allIcons.value = MdiV6.icons
      break
  }
}

function onClick (name) {
  // this.onCopy(name);
}

onMounted(() => {
  iconSetName.value = props.name
  loadIcon()
})
</script>

<style lang="scss">
.o-icon-set-viewer {
  .search {
    padding: 14px;
    .q-input {
      width: 100%;
      max-width: 600px;

      .q-field__control {
        padding: 0 20px;
      }
    }

    .name {
      font-weight: 600;
    }
  }
  .icons {
    padding: 20px 0;
    .q-btn {
      width: 56px;
      height: 56px;

      &:hover {
        color: var(--q-primary) !important;
      }
    }
  }

  .pagination {
    padding: 14px;
  }
}

.mobile {
  .o-icon-set-viewer {
  }
}
</style>
