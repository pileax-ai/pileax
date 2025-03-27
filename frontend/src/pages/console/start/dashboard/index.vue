<template>
  <o-console-page class="page-dashboard" extension-only>
    <template #actions>
      <o-refresh-btn :loading="loading" @click="fetchData" />
    </template>

    <template #extension>
      <section class="row col-12 q-col-gutter-lg panel" v-if="basic.length">
        <template  v-for="(item, index) in basic" :key="index">
          <section class="col-xl-2 col-md-3 col-sm-12 col-xs-12" v-if="index < 4">
            <o-stat-card v-bind="getArrayItem(StatTypes, item.item)"
                         :value="item.total"
                         :sub-label="`今日新增`"
                         :sub-value="item.increment"
                         accent />
          </section>
        </template>
      </section>
      <section class="row col-12 q-col-gutter-lg panel" v-else>
        <template  v-for="(item, index) in 4" :key="index">
          <section class="col-xs-2 col-md-3 col-sm-12 col-xs-12" v-if="index < 4">
            <o-stat-card skeleton />
          </section>
        </template>
      </section>

      <section class="row col-12 q-col-gutter-lg panel">
        <section class="col-md-6 col-sm-12 col-xs-12">
          <o-common-card class="action-card" accent padding>
            <template #header>
              用户
            </template>

            <section class="">
              <v-chart theme="light" class="chart"
                       :option="getPieData('用户', 'user_type').options"/>
            </section>
          </o-common-card>
        </section>

        <section class="col-md-6 col-sm-12 col-xs-12">
          <o-common-card class="action-card" accent padding>
            <template #header>
              活跃用户
            </template>

            <section class="">
              <v-chart theme="light" class="chart"
                       :option="getPieData('活跃用户', 'user_active').options"/>
            </section>
          </o-common-card>
        </section>

        <section class="col-md-6 col-sm-12 col-xs-12">
          <o-common-card class="action-card" accent padding>
            <template #header>
              交易
            </template>

            <section class="">
              <v-chart theme="light" class="chart"
                       :option="getPieData('交易', 'transaction_source').options"/>
            </section>
          </o-common-card>
        </section>
      </section>
    </template>
  </o-console-page>
</template>

<script setup lang="ts">
/**
 * Page: dashboard
 *
 * vue-charts: https://vue-echarts.dev/
 * echarts: https://stackblitz.com/edit/vue-echarts-vue-3?file=src%2FApp.vue
 * examples: https://echarts.apache.org/examples/en/index.html
 */

import {computed, onActivated, onMounted, ref, watch} from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components'
use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
])
import VChart, { THEME_KEY } from 'vue-echarts';

import OStatCard from 'core/components/card/OStatCard.vue';
import ORefreshBtn from 'core/components/button/ORefreshBtn.vue';

import { GET } from 'src/hooks/useRequest';
import {CountStatistic, StatisticResultModel} from 'src/api/models/statistics';
import {getArrayItem, StatTypes} from 'src/app/metadata';

const stats = ref();
const loading = ref(false);

function fetchData () {
  getStatistics();
}

function getStatistics () {
  loading.value = true;
  stats.value = {} as StatisticResultModel;
  GET({name: 'statistics'}).then(data => {
    stats.value = data as StatisticResultModel;
    loading.value = false;
  }).catch(err => {
    loading.value = false;
  })
}

function getPieData (name :string, type :string) {
  let list = stats.value?.group ? (stats.value.group[type] || []) : [];
  let data = list.map((item :CountStatistic) => {
    return {
      name: item.item || 'NA',
      value: item.count
    }
  });
  let legendData = data.map((item :OptionValue) => item.name);
  return {
    data: data,
    options: {
      title: {
        text: `${name}分布`,
        subtext: '',
        x: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'horizontal',
        top: 'bottom',
        data: legendData,
      },
      series: [
        {
          name: name,
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          }
        }
      ]
    }
  }
}

const basic = computed(() => {
  return stats.value?.basic || [];
})

</script>

<style lang="scss">
.page-dashboard {
  .console-content {
    padding-top: 0;
  }

  .panel {
    margin-top: 0!important;
  }

  .o-common-card {
    .title {
      font-size: 1.1rem;
    }
  }

  .chart {
    //min-height: 360px;
    height: 360px;
  }
}
</style>
