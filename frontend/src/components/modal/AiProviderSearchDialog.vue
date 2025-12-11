<template>
  <o-common-dialog class="ai-provider-search-dialog"
                   position="top"
                   content-class="search-card"
                   :content-style="{ minWidth: '600px', maxWidth: '1200px' }"
                   :show="dialog.type === 'ai-provider-search'"
                   :header="false"
                   @close="onHide">
    <o-ai-provider-search />
  </o-common-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import useDialog from 'core/hooks/useDialog'
import OCommonDialog from 'core/components/dialog/OCommonDialog.vue'
import OAiProviderSearch from 'components/ai/OAiProviderSearch.vue'

const { dialog, onHide } = useDialog()
</script>

<style lang="scss">
.ai-provider-search-dialog {
  .search-card {
    margin-top: 60px;
    border-radius: 8px !important;

    .dialog-content {
      padding: 0;
      min-height: unset;

      .q-field {
        box-shadow: unset !important;
        //background: #324057!important;

        .q-field__prepend {
          padding-left: 8px;
        }
        .q-field__append {
          padding-right: 8px;
        }

        .q-field__marginal, .q-field__input {
          //color: #fff
        }
      }

      .q-field--focused {
        border-radius: 6px 6px 0 0 !important;

        .q-field__inner {
          //background: #324057!important;
        }
      }

      .search-container {
        .search-header {
          .q-item__label {
            padding: 10px 10px;
          }
        }
        .search-results {
          position: relative;
          min-height: 240px;
          max-height: 600px;
          .iconfont {
            font-size: 0.8rem;
          }

          .q-list {
            padding: 0 10px;

            .q-item {
              min-height: 40px;
              border-radius: 4px;
              padding: 8px 16px;

              .time {
                font-size: 0.9rem;
              }
            }
          }

          .q-item__section--avatar {
            min-width: 32px;
            padding-right: 0!important;
          }
        }
        .search-footer {
        }
      }
    }
  }
}
</style>
