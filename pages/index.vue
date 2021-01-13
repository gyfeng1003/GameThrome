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
          href="javascript:void(0);"
          class="button--green"
          @click="sdkAuthrization"
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
      // this.$router.push({ path: '/oauth', query: { id: item._id } })
    },
    sdkAuthrization () {
      console.log('----------')
      const url = window.location.href
      this.$store.dispatch('getWechatSignature', url).then(res=>{
        if (res.data.success === 1) {
          const params = res.data.params
          wx.config({
            debug: true, // 调试模式
            appId: params.appId, // 公众号的唯一标识
            timestamp: params.timestamp, // 生成签名的时间戳
            nonceStr: params.noncestr, // 生成签名的随机串
            signature: params.signature, // 签名
            jsApiList: [ 'chooseWXPay' ]// 需要使用的JS接口列表: 微信支付接口
          })
          wx.ready(() => {
            // wx.chooseWXPay({
            //   timestamp: params.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            //   nonceStr: params.nonceStr, // 支付签名随机串，不长于 32 位
            //   package: params.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
            //   signType: params.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            //   paySign: params.paySign, // 支付签名
            //   success: (res) => {
            //     try {
            //       window.WeixinJSBridge.log(res.err_msg)
            //     } catch (e) {
            //       console.error(e)
            //     }
            //     if (res.err_msg === 'get_brand_wcpay_request:ok') {
            //       // 支付成功
            //     } else {}
            //   }
            // })
          })
        }
      })
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
