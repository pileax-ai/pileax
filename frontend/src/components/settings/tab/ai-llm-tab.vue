<template>
  <setting-card class="ai-llm-tab">
    <o-common-card small>
      <section class="col-12">
        <q-list no-border link>
          <o-common-item size="4rem"
                         label="大模型" class="text-bold">
            <div>
              <o-ai-provider-select-btn anchor="bottom right"
                                        self="top right"
                                        @select="onSelectProvider" />
            </div>
          </o-common-item>

          <template v-if="metadata.name">
            <o-view-item label="名称" :value="metadata.title" />
            <o-view-item label="网址" :value="metadata.home" />
            <o-view-item label="简介" :value="metadata.description" />
          </template>
        </q-list>
      </section>
    </o-common-card>
    <o-common-card title="配置" small header padding v-if="metadata.name">
      <section class="col-12">
        <o-ai-provider-form :provider="metadata" />
      </section>
    </o-common-card>
  </setting-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import OViewItem from 'core/components/list/OViewItem.vue'
import OAiProviderSelectBtn from 'src/components/ai/OAiProviderSelectBtn.vue';
import OAiProviderForm from 'src/components/ai/OAiProviderForm.vue';
import SettingCard from './setting-card.vue';

const provider = ref('');
const metadata = ref<Indexable>({});

function onSelectProvider(value: Indexable) {
  metadata.value = value;
}
</script>

<style lang="scss">
.ai-llm-tab {
  .o-ai-provider-select-btn {
    height: 56px;
    min-width: 200px;
  }
}
</style>
