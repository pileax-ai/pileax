
import { useReaderStoreWithOut } from 'stores/reader'
import { computed } from 'vue'

export default function () {
  const store = useReaderStoreWithOut()

  const consoleMenus = computed(() => {
    return store.getConsoleMenus
  })

  const activity = computed(() => {
    return store.getActivity
  })

  const leftDrawer = computed(() => {
    return store.leftDrawer
  })

  const leftDrawerShow = computed(() => {
    return store.leftDrawer.show
  })

  const leftDrawerHoverShow = computed(() => {
    return store.leftDrawer.hoverShow
  })

  const rightDrawer = computed(() => {
    return store.rightDrawer
  })

  const rightDrawerShow = computed(() => {
    return store.rightDrawer.show
  })

  const rightDrawerHoverShow = computed(() => {
    return store.rightDrawer.hoverShow
  })

  const queryTimer = computed(() => {
    return store.queryTimer
  })

  const currentMainService = computed(() => {
    return store.currentMainService
  })

  const mainService = computed(() => {
    return store.mainService
  })

  const secondaryService = computed(() => {
    return store.secondaryService
  })

  const style = computed(() => {
    return store.settings
  })

  function toggleLeftDrawer() {
    store.toggleLeftDrawer()
  }

  function setActivity(value: string) {
    store.setLeftDrawerItem({key: 'activity', value: value})
  }

  function setLeftDrawerHoverShow(value: boolean) {
    store.setLeftDrawerItem({key: 'hoverShow', value: value})
  }

  function setLeftDrawerWidth(value: number) {
    store.setLeftDrawerItem({key: 'width', value: value})
  }

  function closeRightDrawer() {
    store.closeRightDrawer()
  }

  function toggleRightDrawer() {
    store.toggleRightDrawer()
  }

  function toggleShowRightDrawer() {
    setRightDrawerHoverShow(true)
  }

  function setRightDrawerHoverShow(value: boolean) {
    store.setRightDrawerItem({key: 'hoverShow', value: value})
  }

  function setRightDrawerSplit(value: boolean) {
    store.setRightDrawerItem({key: 'split', value: value})
  }

  function setRightDrawerWidth(value: number) {
    store.setRightDrawerItem({key: 'width', value: value})
  }

  function setRightDrawerView(view: 'agent' | 'note' | 'settings' | 'tts', value: boolean) {
    store.setRightDrawerItem({key: view, value: value})
    if (value) {
      store.setRightDrawerItem({key: 'view', value: view})
      // store.showRightDrawer()

      if (!rightDrawerShow.value) {
        setTimeout(() => {
          setRightDrawerHoverShow(true)
        }, 100)
      }
    }
  }

  function toggleRightDrawerView(view: 'note' | 'settings' | 'tts') {
    const value = rightDrawer.value[view]
    setRightDrawerView(view, !value)
  }

  function setQueryTimer(time: number) {
    store.setQueryTimer(time)
  }

  function setCurrentMainService(value: string) {
    store.setCurrentMainService(value)
  }

  return {
    consoleMenus,
    activity,
    leftDrawer,
    leftDrawerShow,
    leftDrawerHoverShow,
    rightDrawerShow,
    rightDrawerHoverShow,
    rightDrawer,
    queryTimer,
    currentMainService,
    mainService,
    secondaryService,
    style,

    toggleLeftDrawer,
    setLeftDrawerHoverShow,
    setLeftDrawerWidth,
    setActivity,
    closeRightDrawer,
    toggleRightDrawer,
    setRightDrawerHoverShow,
    setRightDrawerSplit,
    setRightDrawerWidth,
    setRightDrawerView,
    toggleRightDrawerView,
    setQueryTimer,
    setCurrentMainService,
  }
}
