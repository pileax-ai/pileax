<template>
  <q-list class="background-images">
    <section class="images-container pi-view-grid">
      <template v-for="(item, index) in list" :key="index">
        <div @click="onBackgroundImage(item)">
          <q-responsive :ratio="16/9">
            <q-card class="cover-item" :class="item.theme" flat v-ripple>
              <q-icon name="block" size="3rem" class="text-tips" v-if="item.value === 'none'" />
              <q-img :src="item.url" v-else />

              <q-icon name="check" size="1.6rem"
                      class="action selected bg-primary text-white"
                      v-if="item.url === backgroundImageUrl" />
              <q-icon name="close"
                      class="action bg-red text-white"
                      @click.stop="onDelete(item)"
                      v-else-if="item.user">
                <o-tooltip>{{ $t('delete') }}</o-tooltip>
              </q-icon>
            </q-card>
          </q-responsive>

          <div class="row col-12 justify-between items-center">
            <div class="col text-bold ellipsis">
              {{item.label}}
            </div>
            <div class="col-auto text-tips text-caption">
              {{ $t(`appearances.themes.${item.theme}`) }}
            </div>
          </div>
        </div>
      </template>

      <div>
        <q-responsive :ratio="16/9">
          <q-card class="cover-item" flat v-ripple>
            <o-file-uploader accept=".png,.jpg,.svg"
                             :maxSize="10 * 1024 * 1024"
                             ref-id="book"
                             ref-type="reader-background"
                             reset hide-limit
                             @uploaded="onImageUpload" />
          </q-card>
        </q-responsive>
      </div>
    </section>
  </q-list>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import useReaderSetting from 'src/hooks/useReaderSetting'
import useCommon from 'core/hooks/useCommon'
import useSetting from 'core/hooks/useSetting'
import OFileUploader from 'core/components/fIle/OFileUploader.vue'
import { fileMetaService } from 'src/api/service/remote'
import useApi from 'src/hooks/useApi'
import useCrud from 'src/hooks/useCrud'

const emit = defineEmits(['close'])

const { t, publicPath } = useCommon()
const { theme } = useSetting()
const { getFileUrl } = useApi()
const { crud } = useCrud()
const { settings, setSettingItem } = useReaderSetting()
const userBackgrounds = ref<Indexable[]>([])

const list = computed(() => {
  const defaultList = [
    {
      label: 'None',
      value: 'none',
      theme: 'none',
      size: '100% 100%',
      blur: 0,
      opacity: 1,
      url: '',
    },
    {
      label: t('reading.setting.background.moon'),
      value: 'moon',
      theme: 'none',
      size: '200px 200px',
      position: 'right 20px top 20px',
      blur: 0,
      opacity: 0.5,
      url: '/images/book/moon.png',
    },
    {
      label: t('reading.setting.background.paperTexture'),
      value: 'paper',
      theme: 'none',
      position: '0 0',
      repeat: 'repeat',
      blur: 0,
      opacity: 1,
      url: '/images/book/paper-texture.png',
    },
    {
      label: t('reading.setting.background.cosmicCliffs'),
      value: 'cosmic_cliffs',
      theme: 'dark',
      size: 'cover',
      blur: 125,
      opacity: 1,
      url: '/images/book/dark-cosmic_cliffs.png',
    },
    {
      label: t('reading.setting.background.bubbleNebula'),
      value: 'bubble_nebula',
      theme: 'dark',
      size: 'cover',
      blur: 150,
      opacity: 1,
      url: '/images/book/dark-bubble_nebula.jpg',
    },
    {
      label: t('reading.setting.background.pillarsCreation'),
      value: 'pillars_of_creation',
      theme: 'dark',
      size: 'cover',
      blur: 150,
      opacity: 1,
      url: '/images/book/dark-pillars_of_creation.jpg',
    },
    {
      label: t('reading.setting.background.fuchunMountains'),
      value: 'fuchun_mountains',
      theme: 'light',
      size: 'cover',
      position: 'center',
      blur: 0,
      opacity: 0.65,
      url: '/images/book/light-fuchun_mountains.jpg',
    },
    {
      label: t('reading.setting.background.willowBank'),
      value: 'willow_bank',
      theme: 'light',
      size: 'cover',
      blur: 0,
      opacity: 0.2,
      url: '/images/book/light-willow_bank.jpg',
    },
    {
      label: t('reading.setting.background.oldBook'),
      value: 'old_book',
      theme: 'light',
      size: 'cover',
      blur: 0,
      opacity: 1,
      url: '/images/book/light-old_book.jpg',
    },
  ]

  const userList = userBackgrounds.value.map(item => {
    return {
      label: item.originalName.split('.')[0],
      value: item.id,
      theme: 'none',
      size: 'cover',
      blur: 0,
      opacity: 1,
      url: getFileUrl(item.url),
      user: true
    }
  })

  return defaultList.concat(userList) as Indexable[]
})

const backgroundImageUrl = computed(() => settings.value.backgroundImageUrl)

const onBackgroundImage = async (item: Indexable) => {
  const imagePath = await publicPath(item.url)

  setSettingItem('backgroundImage', imagePath)
  setSettingItem('backgroundImageUrl', item.url)
  setSettingItem('backgroundSize', item.size)
  setSettingItem('backgroundBlur', item.blur)
  setSettingItem('backgroundOpacity', item.opacity)

  // position
  const repeat = item.repeat || 'no-repeat'
  const position = item.position || ''
  setSettingItem('backgroundRepeat', repeat)
  setSettingItem('backgroundPosition', position)

  // Colors
  let fontColor = item.theme === 'dark' ? '#e9e9e9' : '#262626'
  const backgroundColor = 'transparent'
  if (item.theme === 'none') {
    switch (theme.value.name) {
      case 'light':
        fontColor = '#000000'
        break
      case 'dark':
        fontColor = '#f2f2f7'
        break
      case 'darkBlue':
        fontColor = '#E2E2F0'
        break
    }
  } else {
    setSettingItem('backgroundColor', backgroundColor)
  }
  setSettingItem('fontColor', fontColor)
}

function onImageUpload(info: Indexable) {
  queryBackground()
}

function queryBackground() {
  const query = {
    pageIndex: 1,
    pageSize: 100,
    condition: {
      refId: 'book',
      refType: 'reader-background'
    }
  }
  fileMetaService.query(query).then(res => {
    userBackgrounds.value = res.list
  })
}

function onDelete(item: Indexable) {
  crud.remove('fileMeta', item.value, {
    onOk: () => {
      queryBackground()
    }
  })
}

onBeforeMount(() => {
  queryBackground()
})
</script>

<style lang="scss">
.background-images {
  .o-file-uploader {
    height: 100%;
    .file-uploader {
      height: 100%;
      min-height: unset;

      .q-field__control {
        border-radius: 12px;
      }
    }
  }
}
</style>
