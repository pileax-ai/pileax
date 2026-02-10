<template>
  <section class="row col-12 justify-center template-page-footer">
    <section class="row col-12 justify-center footer">
      <section class="row col-12 justify-center footer-main desktop-only">
        <section class="row col-12 o-wide">
          <section class="col-auto q-pr-md about">
            <section class="row items-center">
              <div>
                <img src="logo.png" height="48" />
              </div>
              <div class="q-ml-sm text-bold">{{$t('product.name')}}</div>
            </section>
            <section class="row justify-between socials">
              <q-btn flat round
                     href="https://github.com/pileax-ai/pileax"
                     target="_blank">
                <o-icon name="icon-github" />
              </q-btn>
              <q-btn flat round
                     href="https://discord.gg/8QQWYXF8Vd"
                     target="_blank">
                <o-icon name="icon-discord" />
              </q-btn>
              <q-btn flat round
                     href="https://t.me/pileax_ai"
                     target="_blank">
                <o-icon name="icon-telegram" />
              </q-btn>
              <q-btn flat round
                     href="https://docs.pileax.ai"
                     target="_blank">
                <o-icon name="icon-docs" />
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
              {{`©${(new Date()).getFullYear()}`}} {{$t('product.name')}} AI.
            </div>
          </section>

          <section class="row col justify-end">
            <section class="col-md-3 col-sm-4">
              <header class="">{{ $t('document') }}</header>
              <section class="q-mt-md links">
                <q-btn :label="$t('quickstart')" flat
                       href="https://docs.pileax.ai/quick-start"
                       target="_blank" />
                <q-btn :label="$t('docs')" flat
                       href="https://docs.pileax.ai"
                       target="_blank" />
                <q-btn :label="$t('test')" flat to="/test" />
              </section>
            </section>
            <section class="col-md-3 col-sm-4">
              <header class="">{{ $t('about') }}</header>
              <section class="q-mt-md links">
                <q-btn :label="$t('about')" to="/about" flat />
                <q-btn :label="$t('terms.service')" flat
                       href="https://docs.pileax.ai/agreement"
                       target="_blank" />
                <q-btn :label="$t('terms.privacy')" flat
                       href="https://docs.pileax.ai/privacy"
                       target="_blank" />
              </section>
            </section>
          </section>
        </section>
      </section>
    </section>
  </section>
</template>

<script setup lang="ts">
import useSetting from 'core/hooks/useSetting'
import LocaleHoverBtn from 'core/components/button/LocaleHoverBtn.vue'

const { darkMode, toggleTheme } = useSetting()
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
        font-size: 1.2rem;
        font-weight: 600;
      }

      .iconfont {
        font-size: 1.8rem;
      }

      .links {
        .q-btn {
          color: var(--p-text-readable);
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
