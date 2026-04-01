<template>
  <q-responsive :ratio="3/4">
    <q-card class="book-grid-item" v-ripple>
      <q-img :src="coverUrl" @error="onError">
        <div class="absolute-top text-subtitle1 tags">
          <q-chip square dense>
            {{ tag }}
          </q-chip>
        </div>
        <div class="absolute-bottom text-subtitle1 text-center details">
          <q-btn :label="$t('add')" flat
                 @click.stop="emit('add')" v-if="add" />
          <q-btn :label="$t('details')" flat
                 @click.stop="emit('details')" />
        </div>
      </q-img>
    </q-card>

    <slot></slot>
  </q-responsive>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import useAccount from 'src/hooks/useAccount'
import useApi from 'src/hooks/useApi'

const props = defineProps({
  data: {
    type: Object,
    default: function () {
      return {}
    }
  },
  add: {
    type: Boolean,
    default: false
  },
})
const emit = defineEmits(['add', 'details'])

const { account, workspace } = useAccount()
const { getCoverUrl } = useApi()
const coverUrl = ref('')

const tag = computed(() => {
  const bookOwner = props.data.bookUserId || props.data.userId
  const bookWorkspace = props.data.bookWorkspaceId || props.data.workspaceId
  if (account.value.id === bookOwner) {
    return workspace.value.id === bookWorkspace && workspace.value.type === 'team' ? 'Team Sharing' : 'Personal'
  } else {
    return 'Team'
  }
})

function onError(event: any) {
  coverUrl.value = '/images/ui/page/page-bg.svg'
}

onMounted(() => {
  coverUrl.value = getCoverUrl(props.data)
})

</script>

<style lang="scss">
.book-grid-item {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;

  .q-img {
    height: 100%;
  }

  .details {
    padding: 0;
    visibility: hidden;
    opacity: 0;
    transform: translateY(100%);
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out, visibility 0.3s;

    .q-btn {
      height: 48px;
      width: 100%;
    }
  }

  .tags {
    padding: 4px 4px;
    visibility: hidden;
    opacity: 0;
    transform: translateY(-100%);
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out, visibility 0.3s;

    .q-chip {
      background: rgba(0,0,0,0.1);
      color: #ffffff;
    }
  }

  &:hover {
    .details {
      visibility: visible;
      opacity: 1;
      transform: translateY(0);
    }

    .tags {
      visibility: visible;
      opacity: 1;
      transform: translateY(0);
    }
  }
}
</style>
