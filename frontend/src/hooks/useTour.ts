
import { useAppStoreWithOut } from 'stores/app'
import { computed, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

export default function() {
  const { t } = useI18n()
  const appStore = useAppStoreWithOut()

  const defaultOptions = {
    showProgress: true,
    animate: true,
    overlayColor: 'rgba(0, 0, 0, 0.85)',
    overlayOpacity: 0.3,
    stagePadding: 6,
    popoverClass: 'pi-tour',
    nextBtnText: t('tour.next'),
    prevBtnText: t('tour.prev'),
    doneBtnText: t('tour.done'),
  }

  const tour = computed(() => {
    return appStore.tour
  })

  const tourSteps = computed(() => {
    return {
      navi: [
        {
          element: '.tab-chat',
          popover: {
            title: t('tour.navi.chatTitle'),
            description: t('tour.navi.chatDesc'),
            side: 'right'
          }
        },
        {
          element: '.tab-note',
          popover: {
            title: t('tour.navi.noteTitle'),
            description: t('tour.navi.noteDesc'),
            side: 'right'
          }
        },
        {
          element: '.tab-reading',
          popover: {
            title: t('tour.navi.readingTitle'),
            description: t('tour.navi.readingDesc'),
            side: 'right'
          }
        },
        {
          element: '.tab-knowledge',
          popover: {
            title: t('tour.navi.knowledgeTitle'),
            description: t('tour.navi.knowledgeDesc'),
            side: 'right'
          }
        },
        {
          element: '.tab-ai',
          popover: {
            title: t('tour.navi.aiTitle'),
            description: t('tour.navi.aiDesc'),
            side: 'right'
          }
        },
      ]
    } as Indexable
  })

  const createTour = (name: string, customOptions = {}) => {
    const driverObj = driver({
      ...defaultOptions,
      ...customOptions,
      onDestroyed: (element, step, opts) => {
        if (step.element === opts.config.steps?.at(-1)?.element) {
          closeTour(name)
        }
      },
      onCloseClick: (element, step, opts) => {
        closeTour(name)
        driverObj.destroy()
      },
    })
    const start = async () => {
      const steps = tourSteps.value[name]
      const closed = tour.value[name]
      if (closed || !steps) return

      driverObj.setSteps(steps)
      await nextTick()

      setTimeout(() => {
        driverObj.drive()
      }, 500)
    }
    return {
      start,
      next: driverObj.moveNext,
      prev: driverObj.movePrevious,
      exit: driverObj.destroy
    }
  }

  const closeTour = (name: string) => {
    appStore.closeTour(name)
  }

  return {
    createTour,
  }
}
