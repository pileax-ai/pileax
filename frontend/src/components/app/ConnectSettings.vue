<template>
  <div class="app-connect-settings">
    <header class="row col-12 items-center justify-between">
      ABC
    </header>


    <section>
      Connect
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount, computed } from 'vue'

const emit = defineEmits(['cover'])


</script>

<style lang="scss">
.app-connect-settings {
  width: 400px;
  padding: 10px 0;

  header {
    padding: 0 10px;
    border-bottom: solid 1px var(--q-dark);
  }
  .q-tab, .q-btn {
    min-height: 30px;
    border-radius: 4px;
  }
  .q-tab-panel {
    //padding: 10px;
  }
}
</style>
