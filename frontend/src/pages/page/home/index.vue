<template>
  <o-single-page class="page-home" header footer>
    <content-wide class="row col-12 downloads" content-class="q-py-xl">
      <section class="row col-12 o-banner">
        <section class="col-12">
          <div class="name">{{$t('app.name')}}</div>
          <div class="slogan">{{$t('app.slogan')}}</div>

          <section class="q-mt-lg">
            <section class="row col-12 justify-center" v-if="isMobile">
              <m-app-download />
            </section>
            <o-app-download v-else />
          </section>
        </section>
      </section>
    </content-wide>

    <content-wide class="categories">
      <header>
        <div class="title">
          AI Creation
          <span></span>
        </div>
        <div class="sub-title">
          Explore more options
        </div>
      </header>
      <section class="col-12 relative-position">
        <section class="row col-12" :class="isMobile ? 'q-col-gutter-md' : 'q-col-gutter-xl'">
          <template v-for="(item, index) in Categories" :key="index">
            <section :class="isMobile ? 'col-4' : 'col-2'">
              <div class="bg-secondary category">
                <q-avatar>
                  <o-icon :name="item.icon" size="3rem" class="text-white" disable-svg />
                </q-avatar>
              </div>
              <footer>
                <div class="name text-tips">{{ item.name }}</div>
              </footer>
            </section>
          </template>
        </section>
      </section>
    </content-wide>

    <content-wide class="introduction">
      <header>
        <div class="title">
          {{$t('app.name')}}
          <span></span>
        </div>
        <div class="sub-title">
          {{$t('app.slogan')}}
        </div>
      </header>
      <section class="col-12 relative-position">
        <section class="row col-12" :class="isMobile ? 'q-col-gutter-md' : 'q-col-gutter-xl'">
          <section :class="isMobile ? 'col-12' : 'col-4'">
            <div class="bg-secondary feature">
              <header>
                <o-icon name="icon-chat-sel-light" size="3rem" />
              </header>
              <footer>
                <div class="name">ChatBot</div>
                <div class="q-mt-md">
                  Powerful & intelligent AI chatbot App.
                </div>
              </footer>
            </div>
          </section>
          <section :class="isMobile ? 'col-12' : 'col-4'">
            <div class="bg-secondary feature">
              <header>
                <o-icon name="icon-find-sel-light" size="3rem" />
              </header>
              <footer>
                <div class="name">AI Creation</div>
                <div class="q-mt-md">
                  Write brainstorm, poem, outline, essay, recipe, etc.
                </div>
              </footer>
            </div>
          </section>
          <section :class="isMobile ? 'col-12' : 'col-4'">
            <div class="bg-secondary feature">
              <header>
                <o-icon name="icon-me-sel-light" size="3rem" />
              </header>
              <footer>
                <div class="name">AI Assistant</div>
                <div class="q-mt-md">
                  Acts like a personal assistant and answer any questions in your life.
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
import { computed, ref } from 'vue';

import OSinglePage from 'core/page/template/OSinglePage.vue';
import ContentWide from 'core/page/content/ContentWide.vue';
import OAppDownload from 'components/app/download/OAppDownload.vue';
import MAppDownload from 'components/app/download/MAppDownload.vue';

import { isMobile } from 'core/hooks/useCommon';
import { Categories } from 'src/api/mock/data/data';
</script>

<style lang="scss">
@import "style";
</style>
