
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
        backgroundColor = '#000000'
        fontColor = '#ffffff'
        break
    }
    setSettingItem('backgroundColor', backgroundColor)
    setSettingItem('fontColor', fontColor)
  }

  return {
    store,
    settings,

    setSettingItem,
    setReaderTheme
  }
}
