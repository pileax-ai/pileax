<template>
  <setting-card class="ai-tab">
    <o-common-card small>
      <section class="col-12">
        <q-list no-border link>
          <o-common-item icon="mdi-creation" label="AI提供商"
                         sublabel="设置默认的AI大模型提供商" size="4rem" class="text-bold">
            <div class="row items-center">
              <o-ai-provider-select-btn anchor="bottom right"
                                        self="top right"
                                        class="bg-accent"
                                        @select="onSelectProvider"
                                        persist
                                        enabled-only />
            </div>
          </o-common-item>
          <o-common-item icon="scatter_plot" label="内嵌模型" />
          <o-common-item icon="rotate_right" label="向量数据库" />
          <o-common-item icon="vertical_split" label="文本处理" />
          <o-common-item icon="volume_up" label="语音模型" />
          <o-common-item icon="autorenew" label="转录模型" />
        </q-list>
      </section>
    </o-common-card>
  </setting-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import OAiProviderSelectBtn from 'src/components/ai/OAiProviderSelectBtn.vue';
import SettingCard from './setting-card.vue';

const metadata = ref<Indexable>({});

function onSelectProvider(value: Indexable) {
  metadata.value = value;
}
</script>

<style lang="scss">
.ai-tab {
  .o-ai-provider-select-btn {
    min-width: 200px;
  }
}
</style>
