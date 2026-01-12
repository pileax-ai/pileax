<template>
  <setting-card class="service-log-tab">
    <o-common-card small v-if="false">
      <section class="col-12">
        <q-list no-border link>
          <q-item class="profile">
            <q-item-section avatar>
              <q-avatar size="80px">
                <img :src="avatar || $public('/logo.png')" alt="Avatar" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label caption>Display Name</q-item-label>
              <q-item-label>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </section>
    </o-common-card>

    <section ref="logRef" class="log">
      <template v-for="(line, index) in logLines" :key="index">
        <div class="log-line" :class="{
          'text-tips': line.level === 'debug',
          'text-amber': line.level === 'warn',
          'text-red': line.level === 'error',
        }">
          {{ line.text }}
        </div>
      </template>
    </section>
  </setting-card>
</template>

<script setup lang="ts">
import { inject, nextTick, onActivated, onBeforeMount, onBeforeUnmount, ref } from 'vue'
import useAccount from 'src/hooks/useAccount'
import SettingCard from './setting-card.vue'
import { ipcService } from 'src/api/ipc'

const scrollToBottom = inject<() => void>('scrollToBottom')

const { account, setAccount } = useAccount()
const logLines = ref<Indexable[]>([])

const parseLogLevel = (line: string): string => {
  line = line.trim()
  const levels = ['DEBUG', 'INFO', 'WARN', 'ERROR']
  let level = 'info'
  for (const l of levels) {
    if (line.includes(`${l}`) || line.includes(`[${l.toLowerCase()}]`)) {
      level = l
      break
    }
  }

  return level
}

const parseLine = (text: string) => {
  const level = parseLogLevel(text).toLowerCase()
  return {
    text,
    level
  } as Indexable
}

const parseLog = (text: any) => {
  if (!text || typeof text !== 'string') return

  logLines.value = text.split('\n').map(line => {
    return parseLine(line)
  })

  nextTick(() => {
    scrollToBottom!()
  })
}

onBeforeMount(() => {
  ipcService.logInit(1000).then(res => {
    parseLog(res)

    ipcService.logStart(1000)
  })
  ipcService.onLogUpdate((data) => {
    parseLog(data)
  })
})

onBeforeUnmount(() => {
  ipcService.logStop()
})

onActivated(() => {
  scrollToBottom!()
})
</script>

<style lang="scss" scoped>
.service-log-tab {
  .log {
    font-family: "JetBrains Mono", "Fira Code", monospace;
    white-space: pre-wrap;
    line-height: 1.4;
    margin: 0;
    padding: 0;
  }
  .log-line {
    white-space: pre-wrap;
    line-height: 1.8;
    margin: 0;
    padding: 0;
  }
}
</style>
