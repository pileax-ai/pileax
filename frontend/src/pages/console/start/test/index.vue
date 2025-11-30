<template>
  <o-common-page class="page-test">
    <o-common-card class="row col-12 items-end app">
      <section class="">
        <div class="name">
          {{$t('app.name')}}
        </div>
        <div>
          Just a test
        </div>
      </section>
    </o-common-card>

    <section class="relative-position col-12 navi-card">
      <section class="row col-12 q-col-gutter-lg">
        <section class="col-12">
          <o-common-card title="Notify" header>
            <section class="row col-12 items-center q-col-gutter-md q-pa-md">
              <div style="width: 100px;">Center</div>
              <div>
                <q-btn color="cyan" label="Done" @click="notify('done')" />
              </div>
            </section>
            <section class="row col-12 items-center q-col-gutter-md q-pa-md">
              <div style="width: 100px;">Top</div>
              <div>
                <q-btn color="blue" label="Info" @click="notify('info')" />
              </div>
              <div>
                <q-btn color="positive" label="Success" @click="notify('success')" />
              </div>
              <div>
                <q-btn color="warning" label="Warning" @click="notify('warning')" />
              </div>
              <div>
                <q-btn color="negative" label="Error" @click="notify('error')" />
              </div>
            </section>
            <section class="row col-12 q-col-gutter-md q-pa-md">
              <div style="width: 100px;">Top right</div>
              <div>
                <q-btn color="blue" label="Info" @click="notify('info', 'top-right')" />
              </div>
              <div>
                <q-btn color="positive" label="Success" @click="notify('success', 'top-right')" />
              </div>
              <div>
                <q-btn color="warning" label="Warning" @click="notify('warning', 'top-right')" />
              </div>
              <div>
                <q-btn color="negative" label="Error" @click="notify('error', 'top-right')" />
              </div>
            </section>
          </o-common-card>
        </section>
      </section>
    </section>
  </o-common-page>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';

import OCommonPage from 'core/page/template/OCommonPage.vue';
import { notifyDone, notifyError, notifyInfo, notifySuccess, notifyWarning } from 'core/utils/control'

const notify = (type: string, position = 'top') => {
  switch (type) {
    case 'info':
      notifyInfo('This is a NORMAL notification', {
        position: position
      });
      break;
    case 'success':
      notifySuccess('This is an SUCCESS notification', {
        position: position
      });
      break;
    case 'warning':
      notifyWarning('This is an WARNING notification', {
        position: position
      });
      break;
    case 'done':
      notifyDone();
      break;
    case 'error':
      notifyError('This is an ERROR notification', {
        position: position
      });
      break;
  }
}
</script>

<style lang="scss">
.page-test {
  .app {
    min-height: 80px;
    padding: 21px 21px;

    .name {
      font-size: 48px;
    }
  }

  .navi-card {
    padding: 21px;
  }

  .o-common-card {
    .title {
      font-size: 18px;
    }
  }

}

.mobile {
  .page-test {
    .app {
      padding: 0 16px;
      .name {
        font-size: 32px;
      }
    }

    .navi-card {
      padding: 16px;
    }
  }
}
</style>
