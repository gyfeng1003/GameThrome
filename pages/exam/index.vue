<template>
<div class="container">
  <div class="exam-background">
    <div class="exam-main" v-for="(item, index) in question" v-show="index === step" :key="index">
      <span class="exam-back" v-if="item.back" @click="changeStep(index-1)">
        &lt; 上一步
      </span>
      <div class="exam-title">{{item.title}}</div>
      <div class="exam-content">
        <input type="text" class="exam-content-input" v-if="item.input" v-model.trim="answer[item.inputKey]" @input='input'>
        <div class="exam-content-button" v-for='(btn, i) in item.buttons' @click='chooseAnswer(btn.key, btn.val)' :key='i'>
          {{ btn.prefix ? btn.prefix + ' ' + btn.val : btn.val }}
        </div>
      </div>
    </div>
    <div class="exam-result" v-show="step===3">
    <transition name="rotate">
      <img class="exam-vortex" v-if='animation.vortex' src="https://paio-cdn.visitshanghai.com.cn/international/popularize/picture/2021/01/07/BB79BF5D-CD2B-452D-9153-173777EE1498-1610014849063.png" alt="">
    </transition>
    <transition name="fade">
      <span class="exam-sign" v-if="animation.word">正在穿越</span>
    </transition>
    <transition name="crawl">
      <div class="exam-word" v-if='animation.card'>
      <div style="background:red;"></div>
      <span class="exam-card-title">
        {{ answer.name }}.{{ answer.house }}.{{ answer.profession }}
      </span>
      <div class="exam-card-role">
        你是{{ answer.house }}的{{ answer.profession }}
      </div>
      <div class="exam-card-content">{{ answer.intro }}</div>
      </div>
    </transition>
    <transition name="slide-top">
      <div class="exam-download" v-if="animation.button" @click='previewImage'>
      下载来分享
      </div>
    </transition>
    </div>
  </div>
</div>
</template>
<script>
import { asyncLoadJs } from '../../utils/index'
import { mapState } from 'vuex'
export default {
  middleware: 'wechat-auth',
  head () {
    return {
      title: '穿越回冰火时代，你的结局是？'
    }
  },
 data() {
  return {
   step: 0,
   question: [
     {
       back: false,
       title: '输入你的名字',
       input: true,
       inputKey: 'name',
       buttons: [
         { val: '下一步', key: 'next' }
       ]
     },
     {
       back: true,
       title: '选择你的家族',
       input: false,
       buttons: [
         { val: '史塔克家族', key: 'house', prefix: 'A' },
         { val: '兰尼斯特家族', key: 'house', prefix: 'B' },
         { val: '提利尔家族', key: 'house', prefix: 'C' },
         { val: '拜拉席恩家族', key: 'house', prefix: 'D' },
         { val: '坦格利安家族', key: 'house', prefix: 'E' }
       ]
     },
     {
       back: true,
       title: '选择你的职业',
       input: false,
       buttons: [
         { val: '骑士', key: 'profession', prefix: 'A' },
         { val: '刺客', key: 'profession', prefix: 'B' },
         { val: '阴谋家', key: 'profession', prefix: 'C' },
         { val: '先知', key: 'profession', prefix: 'D' },
         { val: '女巫', key: 'profession', prefix: 'E' },
         { val: '法师', key: 'profession', prefix: 'F' }
       ]
     }
   ],
   answer: {
     name: '',
     house: '',
     profession: '',
     imgUrl: '',
     intro: ''
   },
   animation: {
     vortex: false,
     word: false,
     card: false,
     button: false
   },
   shareOpts: {
     title: '穿越回冰火时代，你的结局是？', // 分享标题
     desc: '', // 分享描述
     link: '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
     imgUrl: '', // 分享图标
     type: 'link', // 分享类型,music、video或link，不填默认为link
     dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
     success: () => {}, // 用户确认分享后执行的回调函数
     cancel: () => {} // 用户取消分享后执行的回调函数
   },
   
  }
 },
 computed: {
   ...mapState([
     'authUser'
   ])
 },
 created() {
    asyncLoadJs('https://cdn.jsdelivr.net/howler.js/2.0.3/howler.min.js').then(()=>{
      // 播放背景音乐
      const music = new window.Howl({
        src: [`https://paioe-cdn.visitshanghai.net/international/video/2021/01/19/487590F0-047E-489F-82C4-BF6745138A42-1611024535745.mp3`],
        autoplay: true,
        loop: true,
        volume: 1
      })
     
      // Clear listener after first call
      music.once('load', () => {
        console.log('load----');
        music.play()
      })
    })
 },
 mounted () {
  const wx = window.wx
  let url = window.location.href
  if (!/(Android)/i.test(navigator.userAgent)) {
    url = localStorage.getItem('url')
  }
  this.shareOpts.desc = `${this.authUser ? this.authUser.nickname : '我'}在冰火中的结局竟然是...`
  this.shareOpts.link = url
  this.shareOpts.imgUrl = `https://paio-cdn.visitshanghai.com.cn/international/picture/2020/08/25/658DBEF5-7BED-4F66-9132-898C82989976-1598351154430.jpg`
  
  this.$store.dispatch('getWechatSignature', url).then(res => {
    if (res.data.success === 1) {
      const params = res.data.params
      wx.config({
        debug: true, // 调试模式
        appId: params.appId, // 公众号的唯一标识
        timestamp: params.timestamp, // 生成签名的时间戳
        nonceStr: params.noncestr, // 生成签名的随机串
        signature: params.signature, // 签名
      //  , 'hideAllNonBaseMenuItem', 'showMenuItems'previewImage
        jsApiList: ['previewImage']// 需要使用的JS接口列表: 预览图片接口，隐藏所有非基础按钮接口，批量显示功能按钮接口
      })
    }
  })

   wx.ready(() => {
     // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
    //  wx.hideAllNonBaseMenuItem()// 隐藏所有非基础按钮
    //  wx.showMenuItems({
    //    // 要显示的菜单项
    //    menuList: [ 'menuItem:favorite', 'menuItem:share:appMessage', 'menuItem:share:timeline', 'menuItem:profile' ]
    //  })
    //  wx.onMenuShareTimeline(this.shareOpts) // 分享到朋友圈
    //  wx.onMenuShareAppMessage(this.shareOpts) // 分享给朋友
   })
  
    // 为文档根元素设置最小高度，防止输入框聚焦时 手机键盘上推而导致页面压缩
    const rootEl = document.documentElement
    rootEl.style.minHeight = rootEl.getBoundingClientRect().height + 'px'
 },
 methods: {
   previewImage () {
     // 预览图片
    //  window.wx.previewImage({
    //    current: this.previewImageUrl, // 当前显示图片的http链接
    //    urls: [ this.previewImageUrl ] // 需要预览的图片http链接列表
    //  })
   },
   chooseAnswer (key, val) {
     // 点击下一步或者选择答案
     if (key !== 'next') this.answer[key] = val
     // 姓名不为空时触发changeStep方法，未输入则触发warning方法，
     this.answer.name
       ? this.changeStep(this.step + 1)
       : this.warning()
   },
   input () {
     // 控制输入框内容长度
     let obj = this.answer
     if (obj.name.length > 8) obj.name = obj.name.substr(0, 8)
     this.shareOpts.desc = obj.name ? `${obj.name}在冰火中的结局竟然是...` : `${this.authUser.nickname}在冰火中的结局竟然是...`
   },
   changeStep (step) {
    // 更改步骤状态
    this.step = step
    let as = this.answer
    switch (step) {
      case 0:
        as.house = ''
        break
      case 3:
        this.getResult()
        break
    }
   },
   async getResult () {
     let {openid} = this.authUser
     const res = await this.$store.dispatch('finishExam', {
       openid,
       house: this.authUser.house,
       profession: this.authUser.profession
     })
     const { house, profession, imgUrl, intro } = res.data
     if (res.success) {
       this.answer.intro = `你是${house}的${profession}，${intro}`
       this.answer.imgUrl = imgUrl
       this.shareOpts.imgUrl = `${this.imageCDN}images/${imgUrl}`

       window.wx.onMenuShareTimeline(this.shareOpts)
       window.wx.onMenuShareAppMessage(this.shareOpts)

       this.finishExam()
     }
  },
  warning () {
    // 姓名输入为空时，为输入框添加警告动画Class
    let node = this.$el.getElementsByClassName('exam-content-input')[0]
    let oldClass = node.className
    if (oldClass.indexOf('exam-content-warning') !== -1) return
    node.className = `${oldClass} exam-content-warning`
    setTimeout(() => {
      node.className = oldClass
    }, 300)
  },
  finishExam () {
   // 测试完成，触发一系列动画
   let obj = this.animation
   obj.vortex = true
   obj.word = true
   setTimeout(() => {
     obj.word = false
     obj.card = true
     obj.vortex = false
     setTimeout(() => {
       obj.button = true
     }, 6100)
   }, 1000)
  }
 }
}
</script>
<style lang="less" scoped>
.container {
  font-size: 20px;
  text-align: center;
  position: absolute;
  top:0;
  bottom: 0;
  left: 0;
  right: 0;
}
.exam-background {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  background: #e68434;
  height: 100%;
}
.exam-main {
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 2;
  color: #fff;
  .exam-back {
    position: absolute;
    left: 10%;
    top: -30px;
    z-index: 3;
    font-size: 16px;
  }
  .exam-title {
    margin-bottom: 10%;
  }
  .exam-content {
    >*{
      margin: auto;
      height: 20px;
      line-height: 20px;
    }

    .exam-content-input{
      color: #000;
      text-align: center;
      margin-bottom: 5%;
    }
    .exam-content-warning {
      animation: warning .3s linear;
    }
    .exam-content-button{
      margin-top: 6%;
      background: #e45396;
      text-align: center;
    }
  }
}
.exam-result {
  height: 100%;
  padding-top: 7%;
  position: relative;
  > * {
    width: 100%
  }
  .exam-vortex, .exam-sign {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transform-origin: 0 0;
  }
  .exam-vortex {
    width: 6.5rem !important;
    height: 6.5rem;
    z-index: 1;
  }
  .exam-sign {
    font-size: 1.8em;
    text-align: center;
    color: #fff;
    z-index: 2;
  }
  .exam-card{
    width: 95% !important;
    height: 80%;
    position: relative;
    z-index: 3;
    padding: 10% 7%;
    margin: auto;
    transition: transform 5s;
    transform: matrix(1, 0, 0, 1, 0, 0);
    background: #a79bec;
    background-size: 100% 100%;
    border-radius: 1em;
    box-shadow: 0 0 1.2em rgba(255, 255, 255, .5);
    img {
      display: block;
      width: 75%;
      margin: 0 auto .2rem;
    }
    .exam-card-title {
      display: inline-block;
      font-size: 1.5em;
      border: .15em solid #e6b467;
      outline: 1.5px solid #000;
      padding: .2em .4em;
      margin-bottom: .5em;
      background: #000;
      color: #fff;
    }
    .exam-card-role {
      font-size: 2.7em;
      font-weight: bold;
    }
    .exam-card-content {
      font-size: 1.8em;
      margin: .2em auto 0;
    }
  }
  .exam-download {
    height: 50px;
    line-height: 50px;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 2;
    font-size: 24px;
    letter-spacing: 2px;
    text-align: center;
    color: #fff;
    background: #00ff00;
  }
}
// animation of exam

.rotate-enter-active {
  animation: rotate 5s linear;
}
.rotate-leave-active {
  animation: rotate 5s linear;
  transition: opacity 3.5s;
}
.rotate-leave-to {
  opacity: 0;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg) translate(-50%, -50%)
  }
  50% {
    transform: rotate(360deg) translate(-50%, -50%)
  }
  100% {
    transform: rotate(720deg) translate(-50%, -50%)
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 1.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.slide-top-enter-active, .slide-top-leave-active {
  transition: transform 1s cubic-bezier(.26, .01, .24, 1.74);
}

.slide-top-enter, .slide-top-leave-to {
  bottom: -1.5rem;
  transform: translateY(1.5rem);
}

.crawl-enter-active {
  animation: crawl 6s cubic-bezier(.55,-.01, 0, 1.74);
  transform-origin: 50% 50%;
}

@keyframes crawl {
  0%{
    transform: matrix(0, -.05, .05, 0, 0, 50);
  }
  30% {
    transform: matrix(.4, -.5, .2, .4, 0, 30)
  }
  70% {
    transform: matrix(.6, .5, -.5, .6, 0, 10)
  }
  100% {
    transform: matrix(1, 0, 0, 1, 0, 0)
  }
}

@keyframes warning {
  0% {
    transform: translateX(0);
  }
    
  20% {
    transform: translateX(-5%);
  }
    
  40% {
    transform: translateX(5%);
  }
    
  60% {
    transform: translateX(-2.5%);
  }
    
  80% {
    transform: translateX(2.5%);
  }
    
  100% {
    transform: translateX(0);
  }
}
</style>
