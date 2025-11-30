<template>
  <section class="row col-12 justify-center template-page-footer">
    <section class="row col-12 justify-center footer">
      <section class="row col-12 justify-center footer-main desktop-only">
        <section class="row col-12 o-wide">
          <section class="col-3 q-pr-md about">
            <section class="row items-center">
              <div>
                <img src="logo.png" height="48" />
              </div>
              <div class="q-ml-sm text-bold">{{$t('app.name')}}</div>
            </section>
            <section class="row justify-between socials">
              <q-btn to="/about" flat round>
                <o-icon name="icon-github" />
              </q-btn>
              <q-btn to="/about" flat round>
                <o-icon name="icon-ollama" />
              </q-btn>
              <q-btn to="/about" flat round>
                <o-icon name="icon-huggingface" />
              </q-btn>
              <q-btn to="/about" flat round>
                <o-icon name="icon-deepseek" />
              </q-btn>
            </section>
            <section class="row">
              <q-btn :icon="darkMode ? 'light_mode' : 'dark_mode'"
                     class="bg-accent text-readable q-mr-sm"
                     style="width: 36px;"
                     flat
                     @click="toggleTheme" />
              <locale-hover-btn class="bg-accent text-readable "
                                icon-right="mdi-chevron-down"
                                anchor="bottom left"
                                self="top left"
                                flat show-label />
            </section>
            <div class="copyright">
              {{`©${(new Date()).getFullYear()}`}} {{$t('app.name')}} AI.
            </div>
          </section>

          <section class="row col-9 justify-end">
            <section class="col-3">
              <header class="text-primary">{{ $t('about') }}</header>
              <section class="q-mt-md links">
                <q-btn :label="$t('about')" to="/about" flat />
                <q-btn :label="$t('terms.service')" flat to="/agreement" />
                <q-btn :label="$t('terms.privacy')" flat to="/privacy" />
              </section>
            </section>
            <section class="col-3">
              <header class="text-primary">{{ $t('help') }}</header>
              <section class="q-mt-md links">
                <q-btn :label="$t('help.center')" flat @click="openLink('help')" />
                <q-btn :label="$t('help.faq')" flat @click="openLink('faq')" />
              </section>
            </section>
          </section>
        </section>
      </section>
    </section>
  </section>
</template>

<script setup lang="ts">
import useSetting from 'core/hooks/useSetting';
import LocaleHoverBtn from 'core/components/button/LocaleHoverBtn.vue';

const { darkMode, toggleTheme } = useSetting();
</script>

<style lang="scss">
.template-page-footer {
  //background: #011213;
  //color: #cdd3de;

  .footer {
    .footer-main {
      //background: #011213;
      padding: 5rem 0;

      header {
        font-weight: 600;
      }

      .iconfont {
        font-size: 1.8rem;
      }

      .links {
        .q-btn {
          color: #cdd3de;
          background: var(--q-nebula);
          padding: 6px 0px;
          min-width: 160px;

          .q-btn__content {
            text-align: left !important;
            align-items: start !important;
            justify-content: start !important;
          }
        }

        .q-btn:hover {
          color: var(--q-primary);
        }

        .q-hoverable:hover .q-focus-helper {
          background: inherit;
          opacity: 0;
        }
      }
    }

    hr {
      height: 1px;
      background: rgba(#fff, 0.05);
    }

    .about {
      .socials {
        margin: 20px 0;
        .q-btn {
          background: rgba(#fff, 0.05);
        }

        .q-btn:hover {
          //background: var(--q-secondary);
        }

        .o-icon {
          width: 24px;
          height: 24px;
        }

      }

      .copyright {
        margin-top: 16px;
      }
    }
  }
}
</style>
