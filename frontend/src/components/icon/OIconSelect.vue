<template>
  <section class="o-icon-select">
    <header class="row justify-between items-center search">
      <q-input v-model="term"
               placeholder="Search icons"
               debounce="200"
               outlined dense clearable>
        <template #prepend>
          <q-icon name="search" />
        </template>
        <template v-slot:after>
          <q-btn-dropdown color="primary" :label="iconSetTitle"
                          class="bg-primary text-white" flat>
            <q-list>
              <template v-for="(item, index) in IconSets" :key="index">
                <q-item clickable v-close-popup @click="onIconSetClick(item)">
                  <q-item-section>
                    <q-item-label>{{ item.label }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-icon name="done" size="1rem" v-if="item.value === iconSetName" />
                  </q-item-section>
                </q-item>
              </template>
            </q-list>
          </q-btn-dropdown>
        </template>
      </q-input>
    </header>

    <section class="row icons" :class="isMobile ? 'justify-around' : 'justify-start'">
      <q-btn v-for="(item, index) in iconList" :key="index"
             class="text-readable"
             flat
             @click="onSelect(item)" v-close-popup>
        <q-icon :name="item.name" size="2.4rem" />
        <o-tooltip>{{item.name}}</o-tooltip>
      </q-btn>
    </section>

    <footer class="row col-12 justify-between items-center pagination">
      <section>
        <q-chip class="bg-accent" square v-if="!isMobile">
          <q-avatar color="primary" text-color="white" style="width: 50px;">Total</q-avatar>
          {{icons.length}}
        </q-chip>
      </section>
      <q-pagination v-model="index"
                    :max="max"
                    :max-pages="isMobile ? 3 : 5"
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
import {computed, onMounted, ref} from 'vue';
import {isMobile} from 'core/hooks/useCommon';
import { IconSets } from 'core/constants/metadata';

import MaterialIcons from 'src/assets/icon-set/material-icons';
import MdiV6 from 'src/assets/icon-set/mdi-v6';

const props = defineProps({
  name: {
    type: String,
    default: 'material-icons'
  },
  title: {
    type: String,
    default: ''
  },
  size: {
    type: Number,
    default: 150
  },
  menu: {
    type: Boolean,
    default: false
  },
});
const emit = defineEmits(['select']);

const term = ref('');
const selected = ref('');
const iconSetName = ref('material-icons');
const iconSetTitle = ref('Material Icons');
const allIcons = ref<Indexable[]>([]);
const index = ref(1);

const icons = computed(() => {
  if (term.value) {
    return allIcons.value.filter(e => e.name.indexOf(term.value) >= 0);
  } else {
    return allIcons.value;
  }
});

const iconList = computed(() => {
  let start = (index.value - 1) * props.size;
  let end = index.value * props.size;
  return icons.value.slice(start, end);
})

const max = computed(() => {
  let total = icons.value.length;
  let max = total / props.size;
  if (total % props.size !== 0) {
    max += 1;
  }
  return max;
})

function loadIcon () {
  switch (iconSetName.value) {
    case 'material-icons':
      allIcons.value = MaterialIcons.icons;
      break;
    case 'mdi-v6':
      allIcons.value = MdiV6.icons;
      break;
  }
}

function onSelect (item: Indexable) {
  selected.value = item.name;
  emit('select', item);
}

function onIconSetClick (item: Indexable) {
  iconSetName.value = item.value;
  iconSetTitle.value = item.label;
  loadIcon();
}

onMounted(() => {
  iconSetName.value = props.name;
  loadIcon();
})
</script>

<style lang="scss">
.o-icon-select {
  .search {
    padding: 0 8px;
    .q-input {
      width: 100%;

      .q-field__control {
        padding: 0 20px;
      }
    }
    .q-btn-dropdown {
      height: 40px;
    }
  }

  .selected-icon {
    height: 30px;
    padding-top: 14px;

    .q-chip {
      margin: 0;
      height: 36px;
    }

    .q-btn {
      height: 36px;
      padding: 4px 8px;
    }
  }

  .icons {
    padding: 10px 0;
    .q-btn {
      width: 42px;
      height: 42px;

      &:hover {
        color: var(--q-primary) !important;
      }
    }
  }

  .pagination {
    padding-top: 10px;
  }

}

.mobile {
  .o-icon-select {
    .search {
      padding: 0 0 14px 0;
    }
  }
}
</style>
