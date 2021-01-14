<template>
 <div class="house-page">
   <img :src="imageCDN + house.cname + '?imageView2/1/w/750/h/460/format/jpg/q/90|imageslim'" alt="">
   <div class="focusHouse-text">
     <p>{{house.words}}</p>
     <p>{{house.name}}</p>
   </div>
   <div class="focusHouse-body">
     <div class="title">{{house.cname}}</div>
     <div class="body">{{house.intro}}</div>
     <div>主要角色</div>
     <div class="body" v-for="(item, index) in house.swornMembers" :key="index">
       <div>{{item.cname}}</div>
       <div>{{item.text}}</div>
     </div>
     <div class="sections" v-for="(item, index) in house.sections" :key="index">
       <div class="title">{{item.title}}</div>
       <div class="body" v-for="(text, id) in item.content" :key="id">{{text}}</div>
     </div>
   </div>
 </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  middleware: 'wechat-auth',
  transition: {
    name: 'slide-left'
  },
  head() {
    return {
      title: '家族详情'
    }
  },
  computed: {
    ...mapState({
      imageCDN: 'imageCDN',
      house: 'focusHouse'
    })
  },
  beforeCreate() {
    let id = this.$route.query.id
    this.$store.dispatch('focusHouse', id)
  }
}
</script>
<style scoped lang="less" src="static/less/house.less"></style>