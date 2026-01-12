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
          {{$t('product.name')}}
          <span></span>
        </div>
        <div class="sub-title">
          {{$t('product.slogan')}}
        </div>
      </header>
      <section class="col-12 relative-position">
        <section class="row col-12 q-col-gutter-xl">
          <section class="col-4">
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
          <section class="col-4">
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
          <section class="col-4">
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
import { computed, ref } from 'vue'
import OSinglePage from 'core/page/template/OSinglePage.vue'
import ContentWide from 'core/page/content/ContentWide.vue'

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
