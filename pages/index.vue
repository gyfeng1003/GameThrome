<template>
  <div class="container">
    <div class="house-content" v-for="(item, index) in houses" :key="index" @click="focusHouse(item)">
      <div class="words">{{ item.words }}</div>
      <div class="name">{{ item.name }}</div>
      <div class="cname">{{ item.cname }}</div>
    </div>
    <!-- <div class="povCharacters">
      <div class="title">主要人物</div>
      <div class="povCharacter-wrapper">
        <div class="povCharacter-content" v-for='(item, index) in characters' :key='index' @click='focusCharacters(item)'>
          <div class="povCharacter-text">
            <div class="cname">{{ item.cname }}</div>
            <div class="name">{{ item.name }}</div>
            <div class="playedBy">{{ item.playedBy }}</div>
          </div>
        </div>
      </div>
    </div> -->
    <div class="links">
      <a
        href="javascript:void(0);"
        class="button--green"
        @click="sdkAuthrization"
      >
        SDK授权
      </a>
    </div>
    <div class="placeholder"></div>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  middleware: 'wechat-auth',
  head () {
    return {
      title: '冰火脸谱'
    }
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
    },
    focusCharacters(item) {
      // 路由跳转到Character，附带查询参数id
      this.$router.push({ path: '/character', query: { id: item._id } })
    },
    sdkAuthrization () {
      console.log('----------')
      const url = window.location.href
      alert(url)
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

<style lang="less" scoped>
 .container {
  margin: 0 auto;
  text-align: center;
  background: #f5f5f5;
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow-y: scroll;
  .house-content {
    padding: 15px;
    background: #fff;
    text-align: left;
    border-bottom: 1px solid #f5f5f5;
    box-sizing: border-box;
  }
  .povCharacters {
    .title {
      font-size: 18px;
      font-weight: bold;
      padding: 10px 0;
    }
    .povCharacter-wrapper {
      .povCharacter-text {
        text-align: left;
        padding: 15px;
        background: #fff;
        border-bottom: 1px solid #f5f5f5;
      }
    }
  }
  .placeholder {
    height: 1.5rem;
  }
  .links {
    a {
      display: inline-block;
      height: 1rem;
      line-height: 1rem;
      width: 33%;
      text-align: center;
      background: #e76464;
    }
  }
}
</style>
