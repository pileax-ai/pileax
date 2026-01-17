<template>
  <o-common-page class="page-welcome" scrollable>
    <o-common-card class="row items-end app">
      <section class="text-center">
        <div class="name">
          {{$t('product.name')}}
        </div>
        <div class="text-tips">
          {{$t('product.slogan')}}
        </div>
      </section>
    </o-common-card>

    <section class="navi-cards">
      <div class="row col-12 justify-center panel">
        <o-common-card icon="o_forum"
                       :title="$t('chat._')"
                       header-class="text-tips"
                       separator-class="transparent"
                       header>
          <conversation-list :items="conversations" />
        </o-common-card>
      </div>

      <div class="row col-12 justify-center panel">
        <o-common-card icon="o_notes"
                       :title="$t('note._')"
                       header-class="text-tips"
                       separator-class="transparent"
                       header>
          <note-list :items="notes" />
        </o-common-card>
      </div>

      <div class="row col-12 justify-center panel">
        <o-common-card icon="o_chrome_reader_mode"
                       :title="$t('reading._')"
                       header-class="text-tips"
                       separator-class="transparent"
                       header>
          <book-list :items="books" />
        </o-common-card>
      </div>
    </section>
  </o-common-page>
</template>

<script setup lang="ts">
import { ref, onActivated, watch } from 'vue'
import { useDocumentVisibility } from '@vueuse/core'
import OCommonPage from 'core/page/template/OCommonPage.vue'
import ConversationList from './conversation/ConversationList.vue'
import NoteList from './note/NoteList.vue'
import BookList from './reading/BookList.vue'

import {
  chatConversationService,
  noteService,
  workspaceBookService
} from 'src/api/service/remote'

const visibility = useDocumentVisibility()
const conversations = ref<Indexable[]>()
const notes = ref<Indexable[]>()
const books = ref<Indexable[]>()
const recentQuery = {
  pageSize: 12,
  sort: {
    updateTime: 'desc'
  }
}

function init() {
  getRecentConversations()
  getRecentNotes()
  getRecentBooks()
}

const getRecentConversations = () => {
  chatConversationService.query(recentQuery).then(res => {
    conversations.value = res.list
  })
}

const getRecentNotes = () => {
  noteService.query(recentQuery).then(res => {
    notes.value = res.list
  })
}

const getRecentBooks = () => {
  workspaceBookService.queryDetails({
    ...recentQuery,
    sort: {
      'userbook.update_time': 'desc'
    }
  }).then(res => {
    books.value = res.list
  })
}

watch(visibility, (state) => {
  if (state === 'visible') {
    init()
  }
})

onActivated(() => {
  init()
})
</script>

<style lang="scss">
.page-welcome {
  .app {
    min-height: 80px;
    padding: 21px 21px;

    .name {
      font-size: 48px;
    }
  }

  .navi-cards {
    padding: 1rem 0;

    .panel {
      &:not(:first-child) {
        margin-top: 1rem;
      }
    }

    .o-common-card {
      width: 100%;
      max-width: 840px;

      .card-header {
        padding: 0 1rem;
      }

      .card-content {
        padding: 0.5rem 1rem;
      }
    }
  }
}

</style>
