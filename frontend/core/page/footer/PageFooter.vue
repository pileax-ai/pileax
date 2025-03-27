<template>
  <section class="row col-12 justify-center template-page-footer">
    <section class="row col-12 justify-center footer">
      <section class="row col-12 justify-center footer-main desktop-only">
        <section class="row col-12 o-wide">
          <section class="col-3 q-pr-md">
            <div>
              <img src="logo.png" height="80" />
            </div>
            <div>{{$t('app.slogan')}}</div>
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

      <q-separator class="col-12 o-wide" />
      <section class="row col-12 justify-between items-center o-wide footer-bottom">
        <div>
          {{`©2023-${(new Date()).getFullYear()}`}} {{$t('app.name')}}, All rights reserved.
        </div>
      </section>
    </section>
  </section>
</template>

<script setup lang="ts">
</script>

<style lang="scss">
.template-page-footer {
  background: #011213;
  color: #cdd3de;

  .footer {
    .footer-main {
      background: #011213;
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

    .footer-bottom {
      height: 120px;

      .socials {
        .q-btn {
          margin: 0 12px;
          background: rgba(#fff, 0.05);
        }

        .q-btn:hover {
          color: white;
          background: var(--q-primary);
        }

        .iconfont {
          font-size: 1.5rem;
        }

      }
    }
  }
}
</style>
