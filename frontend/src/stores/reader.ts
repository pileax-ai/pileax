import { defineStore } from 'pinia'
import { store } from 'stores/index'
import { CODE } from 'core/app'
import type { MenuItem } from 'core/types/menu'
import { defaultReaderMenus } from 'src/app/default-reader-menu'
import { nestMenu } from 'core/hooks/useMenu'
import { defaultSetting } from 'src/app/default-reader-setting'
import { TTSOptions } from 'src/api/service/tts'

export const useReaderStore = defineStore('reader', {
  state: () => ({
    leftDrawer: {
      show: true,
      hoverShow: false,
      width: 300,
      activity: '',
    } as Indexable,
    rightDrawer: {
      show: true,
      hoverShow: false,
      width: 400,
      split: false,

      // views
      view: '',
      settings: false,
      tts: false,
      note: false,
      noteId: ''
    } as Indexable,
    tts: {
      provider: 'browser',
      voiceName: '',
      voiceGender: 'female',
      lang: 'zh-CN',
      rate: '1.0',
      pitch: '1.0',
      volume: '1.0',
      initFrom: '',
    } as Indexable,
    ttsModel: {
      modelProvider: '',
      modelName: '',
      modelType: 'tts',
    } as Indexable,
    menus: [] as MenuItem[],
    consoleMenus: [] as MenuItem[],
    currentMainService: 'chat',
    mainService: [] as Indexable[],
    secondaryService: [] as Indexable[],
    settings: defaultSetting
  }),
  getters: {
    getActivity: (state) => state.leftDrawer.activity,
    getConsoleMenus: (state) => {
      const menus = state.menus.filter(e => e.type && e.type < 10 && e.isShow === 1)
      if (menus.length === 0) {
        return defaultReaderMenus
      }
      return nestMenu(menus)
    },
  },
  actions: {
    toggleLeftDrawer() {
      this.leftDrawer.show = !this.leftDrawer.show
    },
    setLeftDrawerItem(kv: KeyValue) {
      this.leftDrawer[kv.key] = kv.value
    },
    closeRightDrawer() {
      this.rightDrawer.show = false
    },
    toggleRightDrawer() {
      this.rightDrawer.show = !this.rightDrawer.show
    },
    showRightDrawer() {
      this.rightDrawer.show = true
    },
    setRightDrawerItem(kv: KeyValue) {
      this.rightDrawer[kv.key] = kv.value
    },
    setSettingItem(key: string, value: any) {
      this.settings[key] = value
    },
    setTTSItem(key: string, value: any) {
      console.log('setTTSItem', key, value)
      this.tts[key] = value
    },
    setTTSModel(value: Indexable) {
      this.ttsModel = value
    },
    setCurrentMainService(value: string) {
      this.currentMainService = value
    }
  },
  persist: {
    key: `${CODE}.reader`
  }
})

export const useReaderStoreWithOut = () => {
  return useReaderStore(store)
}
