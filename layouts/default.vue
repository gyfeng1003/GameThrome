<template>
<div id="app">
  <div id="main">
    <nuxt />
  </div>
  <v-nav></v-nav>
</div>
</template>
<script>
import vNav from '~/components/nav.vue'
export default {
  components: {
    vNav
  }
}
</script>
<style>

</style>
