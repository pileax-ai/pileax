<template>
  <section class="book-options layout">
    <section>
      <q-list>
        <q-expansion-item icon="visibility" :label="$t('reading.setting.options.visibility')"
                          header-class="header bg-accent"
                          default-opened>
          <div>
            <q-checkbox v-model="hideSup"
                        :label="$t('reading.setting.options.hideSuperscript')" />
          </div>
          <div>
            <q-checkbox v-model="hideSub"
                        :label="$t('reading.setting.options.hideSubscript')" />
          </div>
          <div>
            <q-checkbox v-model="hideParentheticalCitation"
                        :label="$t('reading.setting.options.hideParentheticalCitation')" />
          </div>
        </q-expansion-item>
      </q-list>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import useReaderSetting from 'src/hooks/useReaderSetting'

defineProps({
  fixedLayout: {
    type: Boolean,
    default: false
  },
})
const emit = defineEmits(['next'])
const { settings, setSettingItem } = useReaderSetting()

const hideSup = computed({
  get() {
    return getValue('sup')
  },
  set(value: boolean) {
    setValue('sup', value)
  }
})

const hideSub = computed({
  get() {
    return getValue('sub')
  },
  set(value: boolean) {
    setValue('sub', value)
  }
})

const hideParentheticalCitation = computed({
  get() {
    return getValue('parentheticalCitation')
  },
  set(value: boolean) {
    setValue('parentheticalCitation', value)
  }
})

const getValue = (key: string) => {
  return (settings.value.hideItems || []).includes(key)
}

const setValue = (key: string, value: boolean) => {
  const itemSet = new Set(settings.value.hideItems || [])

  if (value) {
    itemSet.add(key)
  } else {
    itemSet.delete(key)
  }
  setSettingItem('hideItems', Array.from(itemSet))
}
</script>

<style lang="scss">
.book-options {

}
</style>
