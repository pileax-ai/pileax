<template>
  <setting-card class="profile-tab">
    <o-common-card small>
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
                <q-input v-model="name" class="pi-field"
                         debounce="800"
                         @update:modelValue="onUpdateName"
                         standout dense autofocus />
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </section>
    </o-common-card>
    <o-common-card icon="o_security" title="安全" small header padding>
      <section class="col-12">
        <q-list no-border link>
          <o-common-item label="Email" :sublabel="account.email" />
          <o-common-item label="Password" sublabel="Change your login password.">
            <div>
              <q-btn label="修改密码" class="bg-accent text-tips" flat />
            </div>
          </o-common-item>
          <o-common-item label="Passkeys" sublabel="Securely sign-in on-device biometric authentication.">
            <div>
              <q-btn label="Add passkey" class="bg-accent text-tips" flat />
            </div>
          </o-common-item>
        </q-list>
      </section>
    </o-common-card>
    <o-common-card icon="o_assignment_ind" title="User ID" small header padding>
      <section class="col-12">
        <q-list no-border link>
          <o-common-item label="UserID">
            <div class="row items-center text-readable">
              <span class="q-mr-sm">{{account.id}}</span>
              <o-copy-btn :value="account.id" flat dense />
            </div>
          </o-common-item>
        </q-list>
      </section>
    </o-common-card>
  </setting-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { userService } from 'src/api/service/remote/user';
import useAccount from 'src/hooks/useAccount';
import SettingCard from './setting-card.vue';

const { account, setAccount } = useAccount();
const name = ref('');
const avatar = ref('');

function onUpdateName() {
  console.log('name', name.value);
  setAccount({ ...account.value, name: name.value });
  userService.save({ id: account.value.id, name: name.value });
}

onMounted(() => {
  name.value = account.value.name;
  avatar.value = account.value.avatar;
})
</script>

<style lang="scss">
.profile-tab {
  .profile {
    padding: 8px 0;
    .q-field {
      max-width: 320px;
    }
  }
}
</style>
