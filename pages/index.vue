<template>
  <div class="container">
    <div>
      <logo />
      <ul>
        <li v-for="(data, index) in houses" :key="index">
          {{data.name}}
          <span @click="focusHouse(data)">查看详情</span>
        </li>
      </ul>
      <h1 class="title">
        GameThrome
      </h1>
      <h2 class="subtitle">
        My top-notch Nuxt.js project
      </h2>
      <div class="links">
        <a
          href="https://nuxtjs.org/"
          target="_blank"
          class="button--green"
        >
          Documentation
        </a>
        <a
          href="https://github.com/nuxt/nuxt.js"
          target="_blank"
          class="button--grey"
        >
          GitHub
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import Logo from '~/components/Logo.vue'

export default {
  // middelware: "wechat-auth",
  head () {
    return {
      title: '冰火脸谱'
    }
  },
  components: {
    Logo
  },
  beforeCreate () {
    // 请求所有家族和主要人物
    this.$store.dispatch('fetchHouses')
    this.$store.dispatch('fetchCharacters')
  },
  computed: {
    ...mapState([
      "houses",
      "characters"
    ])
  },
  methods: {
    focusHouse (item) {
      // 路由跳转到house，附带查询参数id
      this.$router.push({ path: '/house', query: { id: item._id } })
    }
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}

li span {
  border-bottom: 1px solid #ff0000;
}
</style>
