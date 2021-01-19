<template>
  <div id="nav" v-if="navVisible">
    <nuxt-link v-for="(item, index) in navList" :to="item.path" :key="index">
      <div v-if="index === 0">
        <img v-if="activeRoute !== item.name" src="~static/images/home.png">
        <img v-else src="~static/images/home-selected.png">
      </div>
      <div v-else-if="index === 1">
        <img v-if="activeRoute !== item.name" src="~static/images/shopping.png">
        <img v-else src="~static/images/shopping-selected.png">
      </div>
      <div v-else>
        <img v-if="activeRoute !== item.name" src="~static/images/user.png">
        <img v-else src="~static/images/user-selected.png">
      </div>
    </nuxt-link>
  </div>
</template>
<script>
export default {
  data() {
    return {
      navList: [
        {
          'path': '/',
          'name': 'index',
          'text': '冰火脸谱'
        },
        {
          'path': '/shopping',
          'name': 'shopping',
          'text': '周边手办'
        },
        {
          'path': '/user',
          'name': 'user',
          'text': '个人中心'
        }
      ]
    }
  },
  computed: {
    activeRoute () {
      return this.$route.name
    },
    navVisible () {
      return ['index', 'shopping', 'user'].indexOf(this.activeRoute) > -1
    }
  }
}
</script>
<style lang="less" scoped>
@import '~/static/less/var.less';
#nav {
  width: 100%;
  height: @navHeight;
  background-color: @grey-100;
  border-top: 1px solid @grey-400;
  display: flex;
  display: -webkit-flex;
  display: -webkit-box;
  display: -ms-flexbox;
  text-align: center;
  font-size: 0;
  position: absolute;
  bottom: 0;
  left: 0;
  > * {
    height: 100%;
    font-size: 14px;
    color: #565656;
    display: block;
    flex: 1;
    -webkit-flex: 1;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    display: flex;
    display: -webkit-flex;
    display: -webkit-box;
    display: -ms-flexbox;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    text-decoration: none;
    > div {
      margin: auto;
      height: 100%;
      img {
        width: 70%;
        height: 100%;
      }
    }
  }
  .nuxt-link-exact-active {
    color: #5AACA5;
  }
}
</style>
