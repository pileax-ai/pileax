<template>
  <section class="system-config-tab">
    <section class="col-12">
      <q-list no-border link>
        <template v-for="(value, key, index) in settings" :key="index">
          <o-common-item size="4rem"
                         :label="key"
                         :sub-label="true">
            <template #sublabel>
              <div>
                {{ value }}
              </div>
            </template>
            <div>
              <q-btn class="text-tips bg-accent"
                     :label="$t('change')"
                     flat @click="onChange({key, value})" />
            </div>
          </o-common-item>
        </template>
      </q-list>
    </section>

    <o-side-dialog v-bind="side"
                   :seamless="false"
                   scrollable
                   @show="side.show = true"
                   @close="onSideClose">
      <template #content>
        <o-simple-form-page enable-actions
                            @submit="onSubmit">
          <o-field :label="settingItem.key">
            <q-input v-model="settingItem.value" :placeholder="settingItem.key"
                     class="pi-field"
                     standout dense clearable />
          </o-field>
        </o-simple-form-page>
      </template>
    </o-side-dialog>
  </section>
</template>

<script setup lang="ts">
import { onActivated, onMounted, reactive, ref } from 'vue'
import OSideDialog from 'core/components/dialog/OSideDialog.vue'
import OSimpleFormPage from 'core/page/template/OSimpleFormPage.vue'
import useCommon from 'core/hooks/useCommon'
import { systemSettingService } from 'src/api/service/remote'

const { t } = useCommon()
const settings = ref<Indexable>({})
const settingItem = ref<Indexable>({})

const side = reactive<Indexable>({
  show: false,
  title: t('systems.env'),
  icon: 'data_object',
  position: 'standard',
  style: {width: '30vw', minWidth: '600px'},
  contentClass: 'card pi-card-dialog-theme'
})

const onChange = (item: Indexable) => {
  side.show = true
  settingItem.value = item
}

const onSubmit = () => {
  systemSettingService.setSettingItem(
    settingItem.value.key,
    settingItem.value.value
  ).then(res => {
    side.show = false
    load()
  })
}

const onSideClose = () => {
  side.show = false
}

const load = () => {
  systemSettingService.getSettings().then(res => {
    settings.value = res
  })
}

onActivated(load)
</script>

<style lang="scss">
.system-config-tab {
}
</style>
