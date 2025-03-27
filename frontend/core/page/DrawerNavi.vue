<template>
  <section class="o-drawer-navi">
    <nav class="row justify-center items-center" v-if="withHeader">
      <slot name="action" />
    </nav>

    <q-scroll-area style="" ref="tagsScroll"
                   class="o-scrollarea-sidenavi"
                   :class="{'with-header': withHeader}">
      <slot name="content" />
    </q-scroll-area>

    <footer class="o-drawer-navi-footer" v-if="footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<script setup lang="ts">
defineProps({
  withHeader: {
    type: Boolean,
    default: false
  },
  footer: {
    type: Boolean,
    default: false
  }
});
</script>

<style lang="scss">
.o-drawer-navi {
  position: relative;
  height: 100vh;

  header.top {
    position: absolute;
    top: 0;
    width: 100%;
    height: 40px;
  }

  nav {
    position: absolute;
    top: 0px;
    width: 100%;
    height: 50px;

    a {
      text-decoration: none;
    }
  }

  footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 30px;
  }
}
</style>
