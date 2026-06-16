<template>
  <q-list class="background-textures">
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

      <div v-if="false">
        <q-responsive :ratio="16/9">
          <q-card class="cover-item" flat v-ripple>
            <o-file-uploader accept=".png,.jpg,.svg"
                             :maxSize="10 * 1024 * 1024"
                             ref-id="book"
                             ref-type="reader-background-texture"
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
const { darkMode, theme } = useSetting()
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
      url: '',
    },
    {
      label: 'Asfalt',
      value: 'paper',
      theme: 'none',
      url: '/images/book/texture/asfalt-dark.png',
    },
    {
      label: 'Beige Paper',
      value: 'paper',
      theme: 'none',
      url: '/images/book/texture/beige-paper.png',
    },
    {
      label: 'Paper',
      value: 'paper',
      theme: 'light',
      url: '/images/book/texture/paper.png',
    },
    {
      label: 'Absurdity',
      value: 'paper',
      theme: 'light',
      url: '/images/book/texture/absurdity.png',
    },
    {
      label: 'Arches',
      value: 'paper',
      theme: 'light',
      url: '/images/book/texture/arches.png',
      opacity: 0.75,
    },
    {
      label: 'Church',
      value: 'paper',
      theme: 'light',
      url: '/images/book/texture/church.png',
    },
    {
      label: 'Cubes',
      value: 'paper',
      theme: 'light',
      url: '/images/book/texture/cubes.png',
      opacity: 0.75,
    },
    {
      label: 'Flowers',
      value: 'paper',
      theme: 'light',
      url: '/images/book/texture/flowers.png',
    },
    {
      label: 'Egg Shell',
      value: 'paper',
      theme: 'light',
      url: '/images/book/texture/egg-shell.png',
    },
    {
      label: '3Px Tile',
      value: 'paper',
      theme: 'dark',
      url: '/images/book/texture/3px-tile.png',
    },
    {
      label: 'Arabesque',
      value: 'paper',
      theme: 'dark',
      url: '/images/book/texture/arabesque.png',
      opacity: 0.5,
    },
    {
      label: 'Black Linen',
      value: 'paper',
      theme: 'dark',
      url: '/images/book/texture/black-linen.png',
    },
    {
      label: 'Black Orchid',
      value: 'paper',
      theme: 'dark',
      url: '/images/book/texture/black-orchid.png',
    },
    {
      label: 'Mosaic',
      value: 'paper',
      theme: 'dark',
      url: '/images/book/texture/dark-mosaic.png',
      opacity: 0.5,
    },
    {
      label: 'Washi',
      value: 'paper',
      theme: 'dark',
      url: '/images/book/texture/washi.png',
      opacity: 0.1
    },
    // {
    //   label: 'Test',
    //   value: 'paper',
    //   theme: 'none',
    //   url: 'https://www.transparenttextures.com/patterns/ice-age.png',
    // },
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

  const filterThemes = ['none', darkMode.value ? 'dark' : 'light']
  return defaultList.filter(item => filterThemes.includes(item.theme)) as Indexable[]
})

const backgroundImageUrl = computed(() => settings.value.backgroundImageUrl)

const onBackgroundImage = async (item: Indexable) => {
  const imagePath = await publicPath(item.url)
  const opacity = item.opacity || 1

  setSettingItem('backgroundImage', imagePath)
  setSettingItem('backgroundImageUrl', item.url)
  setSettingItem('backgroundSize', '')
  setSettingItem('backgroundBlur', 0)
  setSettingItem('backgroundOpacity', opacity)

  // position
  setSettingItem('backgroundRepeat', 'repeat')
  setSettingItem('backgroundPosition', '0 0')
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
      refType: 'reader-background-texture'
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
  // queryBackground()
})
</script>

<style lang="scss">
.background-textures {
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
