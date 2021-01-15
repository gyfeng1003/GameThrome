<template>
  <div class="character-page">

  </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
  middleware: 'wechat-auth',
  transition: {
    name: 'slide-left'
  },
  head () {
    return {
      title: '家族成员详情'
    }
  },
  computed: {
    ...mapState({
      character: 'focusCharacter'
    })
  },
  beforeCreate() {
    let id = this.$route.query.id
    // this.$store.dispatch('focusCharacter', id)
  }
}
</script>
<style lang="less" scoped>
.character-page {

}
</style>