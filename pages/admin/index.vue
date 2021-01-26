<template>
  <div class="content">
    <div class="step">
      <h3>1、获取IMDb卡司</h3>
      <button class="btn" @click='crawlerIMDbCharacters'></button>
      | 开始
      <span class="material-icon">touch_app</span>
      <hr>
    </div>
    <div class="step" v-if="step > 1">
      <h3>2. 对比 API 数据。</h3>
      <span class="material-icon">check</span>
      | 表示 API 中存在此英文名，
      <span class="material-icon">mood</span>
      | 表示 API 中存在此演员。
      <button class="btn" @click='checkCharacter'></button>
      | 开始
      <span class="material-icon">touch_app</span>
      <hr>
    </div>
    <div class="step" v-if="step > 2">
      <h3>3. 过滤数据。保留</h3>
      <span class="material-icon">check</span>
      | 且
      <span class="material-icon">mood</span>
      | 的数据
      <button class="btn" @click='filterIMDbCharacters'></button>
      | 过滤
      <span class="material-icon">touch_app</span>
      <hr>
    </div>
    <div class="step" v-if="step > 3">
      <h3>4. 爬取封面</h3>
      <button class="btn" @click="getProfile"></button>
      | 爬封面
      <span class="material-icon">touch_app</span>
      <hr>
    </div>
    <div class="step" v-if="step > 4">
      <h3>5. 爬取剧照（需要等待很长的时间）</h3>
      <button class="btn" @click="getImages"></button>
      | 爬剧照
      <span class="material-icon">touch_app</span>
      <hr>
    </div>
    <div class="step" v-if="step > 5">
      <h3>h3 6. 保存</h3>
      <button class="btn" @click="saveIMDb"></button>
      | 保存
      <span class="material-icon">save</span>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>#</th>
          <th v-if='step > 3'>封面</th>
          <th>英文名</th>
          <th>演员</th>
          <th v-if='step > 4'> 剧照</th>
          <th>chId</th>
          <th>nmId</th>
          <th v-if='checked'>存在 API</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for='(item, index) in IMDb' :key="index">
          <td>{{index+1}}</td>
          <td v-if="step>3">
            <img :src="item.profile" v-if='item.profile' style='width: 80px' alt="">
            <span v-else>等待中</span>
          </td>
          <td><input type="text" v-model='item.name'></td>
          <td><input type="text" v-model='item.playedBy'></td>
          <td v-if='step > 4'>
            <div class="images" style='width: 200px;'>
              <div class="img" v-for="(image, idx) in item.images" :key="idx" :src='image' style='width: 50px; float: left'></div>
            </div>
          </td>
          <td><a :href='"http://www.imdb.com/character/" + item.chId' target="_blank">{{item.chId}}</a></td>
          <td><a :href='"http://www.imdb.com/name/" + item.nmId' target='_blank'>{{item.nmId}}</a></td>
          <td v-if='checked'>
            <div class="material-icon" v-if='findNameInAPICharacters(item)'>check</div>
            <div class="material-icon" v-if='findPlayedByInAPICharacters(item)'>mood</div>
          </td>
        </tr>
      </tbody>
    </table>
    <br>
    <br>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import * as R from 'ramda'
import { find } from 'lodash'
import axios from 'axios'
export default {
  middleware: 'auth',
  layout: 'admin',
  head() {
    return {
      title: '爬取 IMDb cast 数据'
    }
  },
  data () {
    return {
      step: 1,
      loading: false,
      openSnackerbar: false,
      checked: false
    }
  },
  computed: mapState([
    'IMDb',
    'APICharacters'
  ]),
  methods: {
    findNameInAPICharacters (item) {
      return find(this.APICharacters, { name: item.name })
    },

    findPlayedByInAPICharacters (item) {
      return find(this.APICharacters, i => {
        return i.playedBy.includes(item.playedBy)
      })
    },

    // 从 IMDb 上爬取所有的卡司的信息，chId 为角色相关，nmId 为演员相关。通过然后通过 chId 和 nmId 获取相关人物封面图和剧照
    async crawlerIMDbCharacters () {
      this.loading = true
      await this.$store.dispatch('crawlerIMDbCharacters')
      this.step = 2
      this.loading = false
    },

    // 检查 IMDb 上爬到的人物和 API 上的人物名字以及演员是否一致，有些不一致的需要手动修改，如狼爸的名字 IMDb 上与 API 上是不一致的，由于 API 的数据其实是英文的 wiki 上的，所以我们需要以 API 上为准。可以通过 wiki 查寻 wiki 上的名字，然后修改。
    async checkCharacter () {
      this.loading = true
      await this.$store.dispatch('APICharacters')
      this.loading = false
      this.step = 3
      this.checked = true
    },

    async filterIMDbCharacters () {
      const inNameAndPlayedBy = R.filter(i => this.findNameInAPICharacters(i) && this.findPlayedByInAPICharacters(i))

      const IMDb = inNameAndPlayedBy(this.IMDb)
      this.$store.commit('SET_IMDb', IMDb)
      this.step = 4
    },

    // 从 IMDb 上获取人物的封面
    async getProfile () {
      // 地址为 http://www.imdb.com/character/
      let characters = this.IMDb

      for (let i = 0; i < characters.length; ++i) {
        console.log(i)
        if (!characters[i].profile) {
          let character = characters[i]

          const url = `http://www.imdb.com/character/${character.chId}/`

          let { data } = await axios.get('/crawler/getIMDbProfile', {
            params: {
              url: url
            }
          })

          character.profile = data

          if (data) {
            this.$store.commit('UPDATA_IMDB', { character, i })
            this.IMDb.splice(i, 1, character)
          }

          await sleep(500)
        }
      }

      this.step = 5
    },

    // 爬所有的剧照
    async getImages () {
      let characters = this.IMDb

      for (let i = 0; i < characters.length; ++i) {
        console.log(i)
        if (!characters[i].images) {
          let character = characters[i]

          const url = `http://www.imdb.com/character/${character.chId}/mediaindex?ref_=ch_mv_sm`

          let { data } = await axios.get('/crawler/getIMDbImages', {
            params: {
              url: url
            }
          })

          character.images = data

          if (data) {
            this.$store.commit('UPDATA_IMDB', { character, i })
            this.IMDb.splice(i, 1, character)
          }

          await sleep(500)
        }
      }

      this.step = 6
    },
    async saveIMDb () {
      let data = R.filter(i => i.profile)(this.IMDb)
      await axios.post('/crawler/saveIMDb', data)

      this.openSnackbar = true
    }
  }
}
</script>