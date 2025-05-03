
import { useReaderStoreWithOut } from 'stores/reader';
import { computed } from 'vue';

export default function () {
  const store = useReaderStoreWithOut();

  const consoleMenus = computed(() => {
    return store.getConsoleMenus;
  });

  const activity = computed(() => {
    return store.getActivity;
  });

  const leftDrawer = computed(() => {
    return store.leftDrawer;
  });

  const leftDrawerShow = computed(() => {
    return store.leftDrawer.show;
  });

  const leftDrawerHoverShow = computed(() => {
    return store.leftDrawer.hoverShow;
  });

  const rightDrawer = computed(() => {
    return store.rightDrawer;
  });

  const rightDrawerShow = computed(() => {
    return store.rightDrawer.show;
  });

  const rightDrawerHoverShow = computed(() => {
    return store.rightDrawer.hoverShow;
  });

  const queryTimer = computed(() => {
    return store.queryTimer;
  });

  const mainService = computed(() => {
    return store.mainService;
  });

  const secondaryService = computed(() => {
    return store.secondaryService;
  });

  function toggleLeftDrawer() {
    store.toggleLeftDrawer();
  }

  function setActivity(value: string) {
    store.setLeftDrawerItem({key: 'activity', value: value});
  }

  function setLeftDrawerHoverShow(value: boolean) {
    store.setLeftDrawerItem({key: 'hoverShow', value: value});
  }

  function setLeftDrawerWidth(value: number) {
    store.setLeftDrawerItem({key: 'width', value: value});
  }

  function toggleRightDrawer() {
    store.toggleRightDrawer();
  }

  function toggleShowRightDrawer() {
    setRightDrawerHoverShow(true);
    // if (!rightDrawerShow.value) {
    //   setRightDrawerHoverShow(true);
    // } else {
    //   store.toggleRightDrawer();
    // }
  }

  function setRightDrawerHoverShow(value: boolean) {
    store.setRightDrawerItem({key: 'hoverShow', value: value});
  }

  function setRightDrawerSplit(value: boolean) {
    store.setRightDrawerItem({key: 'split', value: value});
  }

  function setRightDrawerWidth(value: number) {
    store.setRightDrawerItem({key: 'width', value: value});
  }

  function setRightDrawerTTS(value: boolean) {
    // console.log('tts', value)
    store.setRightDrawerItem({key: 'tts', value: value});
  }

  function setQueryTimer(time: number) {
    store.setQueryTimer(time);
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
    mainService,
    secondaryService,

    toggleLeftDrawer,
    setLeftDrawerHoverShow,
    setLeftDrawerWidth,
    setActivity,
    toggleRightDrawer,
    toggleShowRightDrawer,
    setRightDrawerHoverShow,
    setRightDrawerSplit,
    setRightDrawerWidth,
    setRightDrawerTTS,
    setQueryTimer,
  };
}
