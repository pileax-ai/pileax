<template>
  <o-single-page class="page-home" footer>
    <content-wide class="row col-12 downloads">
      <section class="row col-12 items-center o-banner">
        <section class="col-12">
          <div class="name">
            <GradientText
              :text="$t('product.name')"
              :colors="['#ffffff', '#3f51b5', '#673ab7', '#00bcd4', '#ffffff']"
              :animation-speed="8"
              show-border
              class-name="your-custom-class"
            />
          </div>
          <div class="slogan">
            {{$t('product.slogan')}}
          </div>
        </section>
      </section>
    </content-wide>

    <content-wide class="app">
    </content-wide>

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
import GradientText from 'components/animated/GradientText.vue'
import OSinglePage from 'core/page/template/OSinglePage.vue'
import ContentWide from 'core/page/content/ContentWide.vue'

import { isMobile } from 'core/hooks/useCommon'
</script>

<style lang="scss">
@import "style";
</style>
