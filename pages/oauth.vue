<template>
  <div class="oauth-page">
    oauth
  </div>
</template>
<script>
function getUrlParam (param) {
  const reg = new RegExp('(^|&)' + param + '=([^&]*)(&|$)')
  const result = window.location.search.substr(1).match(reg)
  return result ? decodeURIComponent(result[2]) : null
}

export default {
  head () {
    return {
      title: 'loading'
    }
  },
  beforeMount () {
    const url = window.location.href
    this.$store.dispatch('getWechatOAuth', url).then(res=>{
      if (res.success) {
        localStorage.setItem('url', url)
        this.$store.dispatch('setAuthUser', res.user)
        const visit = '/' + getUrlParam('state')
        this.$router.replace(visit)
      } else {
        throw new Error('用户信息获取失败')
      }
    })
  }
}
</script>
<style lang="less" scoped>
.oauth-page {

}
</style>
