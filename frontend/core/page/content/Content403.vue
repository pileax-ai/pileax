<template>
  <section class="col-12 content-403" >
    <section class="row col-12 justify-center tips">
      <div class="col-12 text-center title">
        <img src="images/ui/page/no-data.svg" height="300" />
      </div>
      <div class="col-12 text-center text-tips desc">
        无法访问当前页面
      </div>
    </section>
    <section class="row col-12 actions">
      <div class="row col-12 justify-center">
        <q-btn class="color-button-green" :label="$t('back.home')" to="/welcome" />
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { checkPagePermission } from 'src/utils/auth'

const route = useRoute()

function refresh() {
  checkPagePermission(route)
}

onMounted(() => {
  setTimeout(() => {
    refresh()
  }, 500)
})
</script>

<style lang="scss">
.content-403 {
  padding: 100px 0;

  .tips {
    .title {
    }

    .desc {
      font-size: 1.5rem;
    }
  }

  .actions {
    padding: 80px 0;

    .q-btn {
      min-width: 160px;
    }

    .q-btn:not(:first-child) {
      margin-left: 16px;
    }
  }

  .color-button-blue {
    font-size: 1.2rem;
    padding: 10px 28px;
    color: white;
    border-radius: 14px;
    background-image: linear-gradient(245deg, #6B45FF 0%, #2062E9 100%);
  }

  .color-button-green {
    font-size: 1.2rem;
    padding: 10px 28px;
    color: white;
    border-radius: 14px;
    background-image: linear-gradient(245deg, #01212B 0%, #489498 100%);
  }

  .color-button-grey {
    font-size: 1.2rem;
    padding: 10px 28px;
    border-radius: 14px;
  }
}
</style>
