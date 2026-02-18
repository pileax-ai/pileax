<template>
  <o-single-page class="page-error bg-secondary">
    <section class="row col-12 justify-center">
      <div class="col-12 text-center image">
        <img :src="$public('/images/ui/page/404.svg')" alt="404" />
      </div>
      <section class="pi-result">
        <div class="pi-result-title">
          {{ $t('auth.page.accessDenied') }}
        </div>
        <div class="text-readable">
          {{ $t('auth.page.noPermission') }}
        </div>
      </section>

      <div class="row col-12 justify-center" v-if="errorType === 'workspace'">
        <q-btn label="切换空间" class="bg-primary text-white" flat>
          <q-menu class="pi-menu show-side-icon"
                  transition-show="jump-down"
                  :offset="[0, 4]"
                  @before-show="onBeforeShow">
            <q-list style="min-width: 200px;">
              <template v-for="(item, index) in activeWorkspaces" :key="index">
                <o-common-item :icon="item.icon || '🍃'"
                               :label="item.name"
                               :class="{ 'active': item.id === workspace.id }"
                               clickable closable
                               right-side
                               @click="onSwitchWorkspace(item)">
                  <template #side>
                    <q-icon name="done" v-if="item.id === workspace.id" />
                  </template>
                </o-common-item>
              </template>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
      <div class="row col-12 justify-center" v-if="errorType === 'user'">
        <q-btn :label="$t('signout')" class="bg-primary text-white" flat
               @click="logout" />
        <div class="col-12 q-mt-sm text-tips text-center">
          {{ $t('auth.signin.inactive') }}
        </div>
      </div>
    </section>
  </o-single-page>
</template>

<script setup lang="ts">
/**
 * Global 403 page
 */
import OSinglePage from 'core/page/template/OSinglePage.vue'
import useAccount from 'src/hooks/useAccount'
import usePermission from 'src/hooks/usePermission'
import { computed } from 'vue'

const { pageData, resetPageStatus } = usePermission()
const {
  workspace,
  activeWorkspaces,
  logout,
  initWorkspace,
  switchWorkspace
} = useAccount()

const errorType = computed(() => {
  return pageData.value.type
})

const onBeforeShow = () => {
  initWorkspace()
}

const onSwitchWorkspace = (item: Indexable) => {
  switchWorkspace(item)
  // reset
  resetPageStatus()
}
</script>

<style lang="scss">
@import "./styles";
</style>
