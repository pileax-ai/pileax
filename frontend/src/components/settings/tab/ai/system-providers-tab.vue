<template>
  <section class="system-providers-tab">
    <o-common-card small>
      <section class="col-12">
        <q-list no-border link>
          <o-common-item icon="mdi-creation" label="Chat and Reasoning Model (LLM)"
                         sublabel="设置默认的AI大模型提供商"
                         size="4rem"
                         class="text-primary">
            <div class="row items-center">
              <o-ai-model-select-btn icon="mdi-creation" label="LLM" type="chat"
                                     :models="models">
              </o-ai-model-select-btn>
            </div>
          </o-common-item>
          <o-common-item icon="memory" label="Embedding Model">
            <div class="row items-center">
              <o-ai-model-select-btn icon="memory" label="Embedding" type="embedding"
                                     :models="models" />
            </div>
          </o-common-item>
          <o-common-item icon="vertical_split" label="Rerank Model">
            <div class="row items-center">
              <o-ai-model-select-btn icon="vertical_split" label="Rerank" type="rerank"
                                     :models="models" />
            </div>
          </o-common-item>
          <o-common-item icon="volume_up" label="Speech-to-Text Model">
            <div class="row items-center">
              <o-ai-model-select-btn icon="volume_up" label="Speech-to-Text" type="speech2text"
                                     :models="models" />
            </div>
          </o-common-item>
          <o-common-item icon="graphic_eq" label="Text-to-Speech Model (TTS)">
            <div class="row items-center">
              <o-ai-model-select-btn icon="graphic_eq" label="Text-to-Speech" type="tts"
                                     :models="models" />
            </div>
          </o-common-item>
          <o-common-item icon="rotate_right" label="向量数据库" />
        </q-list>
      </section>
    </o-common-card>
  </section>
</template>

<script setup lang="ts">
import { onActivated, ref } from 'vue'
import OAiModelSelectBtn from 'src/components/ai/OAiModelSelectBtn.vue';
import { providerModelService, pdmService } from 'src/api/service/remote';
import useAi from 'src/hooks/useAi';

const { initAiSettings } = useAi();
const models = ref<Indexable[]>();

const getAllModels = () => {
  providerModelService.getAll().then(res => {
    models.value = res
  })
}

const initData = () => {
  getAllModels();
  initAiSettings();
}

onActivated(() => {
  initData();
})
</script>

<style lang="scss">
.system-providers-tab {
  .o-ai-provider-select-btn {
    min-width: 200px;
  }

  .q-item__label {
    font-weight: 500;
  }

  .o-common-item {
    .o-icon {
      font-size: 28px;
    }
  }
}
</style>
