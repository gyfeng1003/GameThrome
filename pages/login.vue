<template>
  <div class="container">
    <div class="card">
      <div class="card-header">
        <div class="card-inner">
          登录
        </div>
      </div>
      <div class="card-body">
        <div class="form" v-if="!isQrcodeLogin">
          <input type="text" class="form-control" v-model='user.email'>
          <input type='password' class="form-control" v-model='user.password'>
          <button class="btn login-btn" @click='login'>登录</button>
        </div>
        <div class="qrcode" v-else>二维码</div>
        <div class="login-text" v-if="isQrcodeLogin" @click="switchLogin(false)">账号密码登录</div>
        <div class="login-text" v-else @click="switchLogin(true)">二维码登录</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      openSnackbar: false,
      user: {},
      isQrcodeLogin: false
    }
  },
  methods: {
    switchLogin (qrcodeLogin) {
      this.isQrcodeLogin = qrcodeLogin
      if (qrcodeLogin) {
        // 生成二维码图片
        
      }
    },
    async login () {
      let { email, password } = this.user

      if (!email || !password) {
        this.openSnackbar = true
        return ''
      }

      let res = await this.$store.dispatch('login', this.user)

      console.log(res)
      if (!res.ret) this.$router.push('/admin')
    }
  }
}
</script>
<style lang="less" scoped>
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-text {
  text-align: right;
  padding: 16px 0;
  font-size: 18px;
  cursor: pointer;
}
.card {
  width: 440px !important;
  height: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #E0E0E0;
  box-shadow: 0 1px 3px rgba(0,0,0,.2), 0 1px 1px rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12);
   .card-header {
    width: 100%;
    border-bottom: 1px solid #E0E0E0;
     .card-inner {
      margin: 12px 16px;
      font-size: 20px;
      line-height: 28px;
     }
   }
   .card-body {
      flex: 1;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      padding-top: 3 * 20px;
      .form {
          width: calc(100% - 4 * 20px)
      }
      .login-btn {
        background-color: #4DB6AC;
        color: #fff;
        height: 42px;
      }
   }
}
.form {
  display: flex;
  flex-direction: column;
}
 
.form-control {
  width: calc(100% - 2 * 20px);
  height: 36px;
  padding: 0 20px;
  line-height: 36px;
  font-size: 14px;
  margin-bottom: .6 * 20px;
}
.content {
  flex: 1;
  height: calc(100vh - 56px);
  padding: 10px 16px 50px 16px;
  overflow: scroll;
}

</style>
