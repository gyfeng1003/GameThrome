<template>
  <div class="content">
    <div class=""></div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import vModal from '~/components/modal'
export default {
  middleware: 'auth',
  layout: 'admin',
  head () {
    return {
      title: '角色数据修改'
    }
  },
  data () {
    return {
      edited: {},
      editCharacterModal: false
    }
  },
  computed: mapState([
    'imageCDN',
    'characters'
  ]),
  created () {
    // this.$store.dispatch('fetchCharacters')
  },
  methods: {
    regImageCDN (url) {
      return url.includes('http')
        ? url
        : `${this.imageCDN}/${url}?imageView2/1/w/280/h/440/format/jpg/q/75|imageslim`
    },
    deleteSection (index) {
      this.edited.sections.splice(index, 1)
    },
    setProfile (item) {
      this.edited.profile = item
    },
    async saveEdited () {
      await this.$store.dispatch('updateCharacter', this.edited)

      this.editCharacterModal = false
    },
    editSection ({ index, index2 }, e) {
      this.edited.sections[index].content[index2] = e.srcElement.innerText
    },
    showModal (item) {
      this.edited = item
      this.editCharacterModal = !this.editCharacterModal
    }
  },
  components: {
    vModal
  }
}
</script>