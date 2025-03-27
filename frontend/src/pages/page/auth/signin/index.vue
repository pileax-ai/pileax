<template>
  <q-page class="page-signin">
    <locale-hover-btn class="text-tips" round enable-hover />

    <section class="blur o-page-container" v-if="blur"></section>
    <section class="row col-12 justify-center items-center fit o-page-container">
      <q-responsive :ratio="16/9" class="app-responsive">
        <section class="row justify-between app-wrapper">
          <app-info>
            <footer class="row justify-center items-center" v-if="isLogin">
              <div>
                <q-btn label="进入控制台" class="bg-primary text-white"
                       rounded flat @click="onEnterConsole" />
              </div>
            </footer>
          </app-info>

          <transition appear
                      :duration="{ enter: 1500, leave: 800 }"
                      enter-active-class="animated slideInRight"
                      leave-active-class="animated fadeOut">
            <section class="signin-wrapper" v-if="!isLogin && showSignIn">
              <o-signin-form @success="onSuccess" />
            </section>
          </transition>
        </section>
      </q-responsive>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { router } from 'src/router';

import useAccount from 'src/hooks/useAccount';

import LocaleHoverBtn from 'core/components/button/LocaleHoverBtn.vue';
import OSigninForm from 'components/app/auth/OSigninForm.vue';
import AppInfo from './children/AppInfo.vue'

const blur = ref(true);
const showSignIn = ref(true);

const { account, isLogin } = useAccount();

function onEnterConsole() {
  // showSignIn.value = !showSignIn.value;
  router.push('/welcome');
}

function onSuccess() {
  showSignIn.value = false;
}
</script>

<style lang="scss">
@import "style";
</style>
