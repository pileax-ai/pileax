<template>
  <o-single-page class="page-about" footer>
    <section>
      <q-carousel
        animated
        v-model="slide"
        arrows
        infinite
      >
        <template v-for="(item, index) in slides" :key="index">
          <q-carousel-slide :name="item.value" :img-src="$public(item.img)" />
        </template>
      </q-carousel>
    </section>

    <content-wide class="introduction">
      <header>
        <div class="title">
          {{$t('tour.features')}}
          <span></span>
        </div>
        <div class="sub-title">
          {{$t('product.slogan')}}
        </div>
      </header>
      <section class="col-12 relative-position">
        <section class="row col-12" :class="isMobile ? 'q-col-gutter-md' : 'q-col-gutter-xl'">
          <section :class="isMobile ? 'col-12' : 'col-4'">
            <div class="bg-secondary feature">
              <header>
                <o-icon name="chat" size="3rem" />
              </header>
              <footer>
                <div class="name">{{ $t('tour.navi.chatTitle') }}</div>
                <div class="q-mt-md">
                  {{ $t('tour.navi.chatDesc') }}
                </div>
              </footer>
            </div>
          </section>
          <section :class="isMobile ? 'col-12' : 'col-4'">
            <div class="bg-secondary feature">
              <header>
                <o-icon name="notes" size="3rem" />
              </header>
              <footer>
                <div class="name">{{ $t('tour.navi.noteTitle') }}</div>
                <div class="q-mt-md">
                  {{ $t('tour.navi.noteDesc') }}
                </div>
              </footer>
            </div>
          </section>
          <section :class="isMobile ? 'col-12' : 'col-4'">
            <div class="bg-secondary feature">
              <header>
                <o-icon name="chrome_reader_mode" size="3rem" />
              </header>
              <footer>
                <div class="name">{{ $t('tour.navi.readingTitle') }}</div>
                <div class="q-mt-md">
                  {{ $t('tour.navi.readingDesc') }}
                </div>
              </footer>
            </div>
          </section>
        </section>
      </section>
    </content-wide>
  </o-single-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import OSinglePage from 'core/page/template/OSinglePage.vue'
import ContentWide from 'core/page/content/ContentWide.vue'
import { isMobile } from 'core/hooks/useCommon'

const slide = ref('1')
const slides = computed(() => {
  return [
    { label: 'Slide 1', value: '1', img: '/images/ui/signin/01.jpg' },
    { label: 'Slide 2', value: '2', img: '/images/ui/signin/02.jpg' },
    { label: 'Slide 3', value: '3', img: '/images/ui/signin/03.png' },
  ]
})
</script>

<style lang="scss">
  @import "style";
</style>
