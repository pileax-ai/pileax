
import { useReaderStoreWithOut } from 'stores/reader'
import { computed } from 'vue'

export default function () {
  const store = useReaderStoreWithOut()

  const settings = computed(() => {
    return store.settings
  })

  function setSettingItem(key: string, value: any) {
    store.setSettingItem(key, value)
  }

  function setReaderTheme(value: string) {
    let backgroundColor = settings.value.backgroundColor
    let fontColor = settings.value.fontColor
    switch (value) {
      case 'light':
        backgroundColor = '#ffffff'
        fontColor = '#000000'
        break
      case 'dark':
        backgroundColor = '#1E1F22'
        fontColor = '#f2f2f7'
        break
      case 'darkBlue':
        backgroundColor = '#1A1C26'
        fontColor = '#E2E2F0'
        break
    }

    // Todo: backgroundColor
    // setSettingItem('backgroundColor', backgroundColor)
    setSettingItem('fontColor', fontColor)
  }

  function setTTSModel(value: Indexable) {
    store.setTTSModel(value)
  }

  return {
    store,
    settings,

    setSettingItem,
    setReaderTheme,
    setTTSModel,
  }
}
