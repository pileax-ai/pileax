<template>
  <q-card class="added-provider-card bg-accent" flat>
    <q-card-section class="header">
      <q-item>
        <q-item-section avatar>
          <q-avatar square>
            <o-svg-icon :name="data.logo" size="2.4rem" colored />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-bold">
            {{data.name}}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <o-menu-btn :label="`配置 (${data.credentials?.length})`"
                      class="text-tips bg-dark"
                      menu-class="pi-menu"
                      icon="tune"
                      min-width="360px"
                      flat dropdown>
            <template #menu>
              <q-item-label class="text-bold">API Keys</q-item-label>
              <template v-for="(item, index) in data.credentials" :key="index">
                <o-common-item icon="vpn_key" right-side clickable closable
                               @click="emit('active-credential', item)">
                  <template #label>
                    <o-chip :color="data.credentialId === item.id ? 'green' : 'tips'" square>
                      {{item.name}}
                    </o-chip>
                  </template>
                  <template #side>
                    <section class="row">
                      <q-btn icon="edit" flat dense v-close-popup
                             @click.stop="emit('edit', item)" />
                      <q-btn icon="delete" color="red" flat dense v-close-popup
                             @click.stop="emit('delete', item)" />
                    </section>
                  </template>
                </o-common-item>
              </template>
              <q-separator />
              <o-common-item icon="add"
                             label="API Key"
                             class="text-primary"
                             clickable closable
                             @click="emit('add')" />
            </template>
          </o-menu-btn>
        </q-item-section>
      </q-item>
    </q-card-section>

    <q-card-section class="tags">
      <q-item-label>
        <template v-for="(item, index) in data.tags?.split(',')" :key="index">
          <q-chip size="10px" dense square>{{item}}</q-chip>
        </template>
      </q-item-label>
    </q-card-section>

    <q-card-section class="row col-12 justify-between content">
      <o-menu-btn :label="`模型 (${data.llm?.length})`"
                  class="text-tips bg-dark"
                  menu-class="pi-menu added-provider-llm-menu"
                  self="top left"
                  anchor="bottom left"
                  min-width="500px"
                  flat dropdown>
        <template #menu>
          <template v-for="(item, index) in data.llm" :key="index">
            <o-common-item :icon="`icon-${data.logo}`" :label="item.llm_name" right-side clickable>
              <template #label>
                <template v-for="(tag, index) in item.tags.split(',')" :key="index">
                  <q-chip size="10px" dense square v-if="tag">{{tag}}</q-chip>
                </template>
              </template>
              <template #side>
                <q-toggle v-model="models[index]" />
              </template>
            </o-common-item>
          </template>
        </template>
      </o-menu-btn>

      <section class="actions">
        <q-btn icon="delete"
               class="text-tips bg-dark q-ml-xs"
               color="red"
               flat
               @click="emit('remove-provider')"
               v-if="data.credentials.length===0"  />
      </section>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import OMenuBtn from 'core/components/menu/OMenuBtn.vue';
import toFixed from 'xe-utils/toFixed'

const props = defineProps({
  data: {
    type: Object,
    default: function () {
      return {}
    }
  },
  showTag: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['add', 'delete', 'edit', 'active-credential', 'remove-provider']);

const models = ref<Indexable>({})
</script>

<style lang="scss">
.added-provider-card {
  position: relative;
  overflow: hidden;

  .header {
    padding: 10px 0 0 0;

    .q-item__section--side {
      min-width: 36px;
      padding-right: 0;
    }
  }

  .tags {
    padding: 0 16px;
  }

  .actions {
    visibility: hidden;
  }

  &:hover {
    .actions {
      visibility: visible;
    }
  }
}

.added-provider-llm-menu {
  .q-list .q-item {
    padding: 0 10px;
  }
}
</style>
