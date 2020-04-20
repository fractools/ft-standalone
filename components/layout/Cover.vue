<template lang="html">
  <section>
    <section>
      <div id="dropdownAvatar" v-if="$store.state.authUser">
        <a-dropdown placement="bottomRight">
          <p class="ant-dropdown-link" style="cursor:pointer;">
            <img class="avatarFloatyRight" v-if="userData.profileImage" :src="userData.profileImage"/>
            <img class="avatarFloatyRight" v-else src="~/assets/pictures/user/DefaultAvatar700px.png"/>
          </p>
          <a-menu slot="overlay" theme="dark" style="padding:0.75em;margin-top:3.5em;margin-right:0.5em;">
            <a-menu-item @click="goToProfile" v-if="$store.state.authUser" key="0">
              <a-icon type="user" />
              <span>Profil</span>
            </a-menu-item>
            <a-menu-item @click="$router.push('/settings')" v-if="$store.state.authUser.role === 'Administrator'" key="1">
              <a-icon type="setting" />
              <span>Settings</span>
            </a-menu-item>
            <a-menu-item @click="$router.push('/login')" key="2">
              <a-icon type="logout" />
              <span>Logout</span>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
      <a-button size="small" v-else @click="$router.push('/login')" style="float:right;margin:0.5em;">Login</a-button>
    </section>
    <section>
      <Logo id="pageLogo"/>
    </section>
    <section style="text-align: center; margin-top: 4em;">
      <div>
        <h1>Welcome to frac.tools WebTemplate</h1>
      </div>
    </section>
  </section>
</template>

<script>
import Logo from '~/components/layout/Logo'

export default {
  async mounted() {
    if (this.$store.state.authUser) {
      this.userData = await this.$getDoc(this.$store.state.authUser.username, 'userdata');
    }
  },
  components: {
    Logo
  },
  data() {
    return {
      userData: {}
    }
  },
  methods: {
    goToProfile() {
      if (this.$nuxt.$route.path != '/user/' + this.$store.state.authUser.username) {
        this.$router.push('/user/' + this.$store.state.authUser.username)
      }
    }
  }
}

</script>

<style lang="css" scoped>
#pageLogo {
  margin-left: 30%;
  margin-top: 10%;
  max-width: 40%;
}
.avatarFloatyRight {
  float: right;
  height: 3em;
  width: 3em;
  border-radius: 50%;
  margin: 0.5em;
  cursor: pointer;
}
#dropdownAvatar {
  float: right;
}
/* .cover {
  background-image: url('../assets/content/cover/background.jpg');
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
} */
</style>
