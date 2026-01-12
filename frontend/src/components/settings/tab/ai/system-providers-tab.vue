<template>
  <section class="system-providers-tab">
    <o-common-card small>
      <section class="col-12">
        <q-list no-border link>
          <o-common-item icon="mdi-creation"
                         :label="$t('ai.models.chatModel')"
                         :sub-label="$t('ai.models.chatTips')"
                         size="4rem"
                         class="text-primary">
            <div class="row items-center">
              <o-ai-model-select-btn icon="mdi-creation"
                                     :label="$t('ai.models.chat')"
                                     type="chat"
                                     :models="models">
              </o-ai-model-select-btn>
            </div>
          </o-common-item>
          <o-common-item icon="memory"
                         :label="$t('ai.models.embeddingModel')">
            <div class="row items-center">
              <o-ai-model-select-btn icon="memory"
                                     :label="$t('ai.models.embedding')"
                                     type="embedding"
                                     :models="models" />
            </div>
          </o-common-item>
          <o-common-item icon="vertical_split"
                         :label="$t('ai.models.rerankModel')">
            <div class="row items-center">
              <o-ai-model-select-btn icon="vertical_split"
                                     :label="$t('ai.models.rerank')"
                                     type="rerank"
                                     :models="models" />
            </div>
          </o-common-item>
          <o-common-item icon="volume_up"
                         :label="$t('ai.models.sttModel')">
            <div class="row items-center">
              <o-ai-model-select-btn icon="volume_up"
                                     :label="$t('ai.models.stt')"
                                     type="speech2text"
                                     :models="models" />
            </div>
          </o-common-item>
          <o-common-item icon="graphic_eq"
                         :label="$t('ai.models.ttsModel')">
            <div class="row items-center">
              <o-ai-model-select-btn icon="graphic_eq"
                                     :label="$t('ai.models.tts')"
                                     type="tts"
                                     :models="models" />
            </div>
          </o-common-item>
          <o-common-item icon="rotate_right"
                         :label="$t('ai.models.vector')" />
        </q-list>
      </section>
    </o-common-card>
  </section>
</template>

<script setup lang="ts">
import { onActivated, ref } from 'vue'
import OAiModelSelectBtn from 'src/components/ai/OAiModelSelectBtn.vue'
import { providerModelService, pdmService } from 'src/api/service/remote'
import useAi from 'src/hooks/useAi'

const { initAiSettings } = useAi()
const models = ref<Indexable[]>()

const getAllModels = () => {
  providerModelService.getAll().then(res => {
    models.value = res
  })
}

const initData = () => {
  getAllModels()
  initAiSettings()
}

onActivated(() => {
  initData()
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
