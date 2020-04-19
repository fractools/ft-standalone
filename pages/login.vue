<template>
  <section style="background:#2e2e2e;padding-top:25vh;min-height:100vh;">
    <div class="authContainer">
      <a-form v-if="!$store.state.initUser" id="authInput" @submit.prevent="login">
        <img id="pageLoginLogo" src="@/assets/pictures/layout/logo.png"/>

        <a-form-item>
          <a-input class="inputLogin" placeholder="Username" v-model="username" type="text" v-autofocus @keyup.enter.native="login"/>
        </a-form-item>

        <a-form-item>
          <a-input class="inputLogin" placeholder="Password" v-model="password" type="password" @keyup.enter.native="login"/>
        </a-form-item>

        <a-form-item>
          <a-button id="loginButton" type="primary" block @click="login">Login</a-button>
        </a-form-item>

      </a-form>
      <a-form v-else id="authInput" @submit.prevent="login">
        <img id="pageLoginLogo" src="@/assets/pictures/layout/logo.png"/>

        <p style="text-align:center;color:white;">Register first User:</p>

        <a-form-item>
          <a-input class="inputLogin" placeholder="Username" v-model="username" type="text" v-autofocus @keyup.enter.native="register"/>
        </a-form-item>

        <a-form-item>
          <a-input class="inputLogin" placeholder="Password" v-model="password" type="password" @keyup.enter.native="register"/>
        </a-form-item>

        <a-form-item>
          <a-input class="inputLogin" placeholder="Password wiederholen" v-model="password2" type="password" @keyup.enter.native="register"/>
        </a-form-item>

        <a-form-item>
          <a-input class="inputLogin" placeholder="Name" v-model="surname" type="text" @keyup.enter.native="register"/>
        </a-form-item>

        <a-form-item>
          <a-input class="inputLogin" placeholder="Lastname" v-model="lastname" type="text" @keyup.enter.native="register"/>
        </a-form-item>

        <a-form-item>
          <a-input class="inputLogin" placeholder="E-Mail" v-model="email" type="text" @keyup.enter.native="register"/>
        </a-form-item>

        <a-form-item>
          <a-button id="loginButton" type="primary" block @click="register">Register</a-button>
        </a-form-item>

      </a-form>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
  layout: 'login',
  data() {
    return {
      username: '',
      password: '',
      password2: '',
      surname: '',
      lastname: '',
      email: ''
    }
  },
  methods: {
    async login() {
      try {
        await this.$store.dispatch('login', {
          username: this.username.toLowerCase(),
          password: this.password
        });
        await this.$router.push('/');
        this.$pushClient(this.$store.state.authUser.username);
      } catch (e) {
        this.$notification['error']({
          message: 'Login Error',
          description: `${e.message}`
        })
      }
    },
    async register() {
      if (this.password !== this.password2) {
        this.$notification['error']({
          message: 'Registering Error',
          description: `Passwords do not match`
        })
      }

      if (!this.username || !this.password || !this.surname || !this.lastname || !this.email) {
        this.$notification['error']({
          message: 'Registering Error',
          description: `Please fill all fields`
        })
      }

      const user = {
        _id: this.username.toLowerCase(),
        username: this.username.toLowerCase(),
        password: this.password,
        role: 'Administrator'
      }
      const userData = {
        _id: this.username.toLowerCase(),
        displayname: this.surname,
        surname: this.surname,
        lastname: this.lastname,
        email: this.email,
        phone: '',
        profileImage: '~/assets/pictures/user/DefaultAvatar700px.png',
        kontaktFavoriten: [],
        kontaktListen: []
      }
      const fullUser = {
        user,
        userData
      }

      try {
        await this.$addUser(fullUser);
        this.$store.commit('INIT_USER', false);
      } catch (e) {
        this.$notification['error']({
          message: 'Login Error',
          description: `${e.message}`
        })
      }
    }
  },
  computed: {
    ...mapState([
      'authUser'
    ])
  }
}



</script>

<style>

#pageLoginLogo {
  height: 5.25em;
  margin: 0.75em;
  padding-bottom: 2em;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.inputLogin {
  background-color: #2e2e2e;
  border-color: #1e1e1e;
  color: white;
  text-align: center;
  min-width: 20em;
}

#para {
  color: white;
  text-align: center;
}

#authInput {
  width: 20em;
  margin: auto;
}
.authContainer {
  background: #1e1e1e;
  width: 25em;
  padding-top: 1em;
  padding-bottom: 1em;
  margin: auto;
}
#loginButton {
  padding-top: 0;
  min-width: 20em;
}

</style>
