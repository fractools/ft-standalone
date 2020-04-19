<template v-if="isReady === true">
  <section>

    <!-- HEADER -->
    <div style="padding-bottom:10em;background-color:#f4f4f4;">
      <img src="~/assets/pictures/layout/logo-black.png" style="float:right;position:absolute;right:1px;height:2em;padding:0.5em;" @click="$router.push('/')">
      <div class="userHeader" :style="{ backgroundImage: 'url(' + userData.headerImage + ')' }">
        <img class="avatarProfileCenter" v-if="userData.profileImage" :src="userData.profileImage"/>
        <img class="avatarProfileCenter" v-else src="~/assets/pictures/user/DefaultAvatar700px.png"/>
        <h1 id="userName">{{ userData.displayname }}</h1>
      </div>
    </div>

    <!-- EDIT BUTTONS -->
    <div id="thisButtons">
      <a-button
        v-if="userDataEdit === false && userData._id === authUser.username"
        @click="userDataEdit = true">
        <a-icon type="setting" /> Edit Profile
      </a-button>

      <a-button type="danger" v-if="userDataEdit === true" @click="userDataEditPassword = true">Change password</a-button>

      <a-button
        v-if="userDataEdit === true"
        @click="saveData()"
        type="primary">
        Save
      </a-button>

      <a-button
        v-if="userDataEdit === true"
        @click="cancelAndReset()"
        type="primary">
        Cancel
      </a-button>

    </div>

    <!-- User Body -->
    <section style="padding: 2em;">

      <div v-if="userDataEdit === true">
        <h2 style="margin-top:1.5em;">General</h2>
        <h4>Displayname: </h4><a-input style="width: 700px;margin-bottom:0.5em;" v-model="userData.displayname"/>
        <h4>E-Mail address: </h4><a-input style="width: 700px;margin-bottom:0.5em;" v-model="userData.email"/>
        <h4>Phone: </h4><a-input style="width: 700px;margin-bottom:0.5em;" v-model="userData.phone"/>

        <h2 style="margin-top:1.5em;">Profilesettings</h2>
        <h4>Profile picture: </h4><a-input style="width: 700px;margin-bottom:0.5em;" v-model="userData.profileImage"/>
        <h4>Cover picture: </h4><a-input style="width: 700px;margin-bottom:0.5em;" v-model="userData.headerImage"/>
      </div>

      <!-- User Info -->
      <h2 v-if="userData._id === authUser.username && userDataEdit === false">Profile: </h2>
      <div style="width:100%;display:flex;flex-direction:row;margin-top:2em;margin-bottom:2em;margin-right:2em;" v-if="userDataEdit === false">
        <!-- LEFT -->
        <div class="left">
          <!--<p>Username:-->
          <p v-if="userData.surname && userDataEdit === false">Surname:
          <p v-if="userData.lastname && userDataEdit === false">Lastname:
          <p v-if="userData.email && userDataEdit === false">
            E-Mail Address:
          </p>
          <div v-if="userDataEdit === true">
            <p>E-Mail Address: </p>
          </div>
          <p v-if="userData.phone && userDataEdit === false">
            Phone:
          </p>
          <div v-if="userDataEdit === true">
            <p>Phone: </p>
          </div>
          <!--<p v-if="userDataEdit === true">
            Password:
          </p>-->
        </div>


        <!-- RIGHT -->
        <div class="right">
          <b class="genUserData">{{ userData.surname }}</b></p>
          <b class="genUserData">{{ userData.lastname }}</b></p>

          <p v-if="userData.email && userDataEdit === false">
            <b>{{ userData.email }}</b>
          </p>

          <div v-if="userDataEdit === true">
            <a-input
              v-model="userData.email"
              class="userEditInput">
            </a-input>
          </div>

          <p v-if="userData.phone && userDataEdit === false">
            <b>{{ userData.phone }}</b>
          </p>

          <div v-if="userDataEdit === true">
            <a-input
              v-model="userData.phone"
              class="userEditInput">
            </a-input>
          </div>
      </div>
    </div>

    <h2 v-if="userData._id === authUser.username && userDataEdit === false">Post something: </h2>

    <!-- STATUS -->
    <div class="status" v-if="userDataEdit === false">
      <div v-if="userData._id === authUser.username">
        <a-textarea placeholder="New post" style="width: 100%; height: 140px;" v-model="newPost"></a-textarea>
        <a-button style="margin-top: 0.5em;" type="primary" block @click="post">Post</a-button>
      </div>
    </div>

    <!-- Password Reset-->
    <div v-if="userDataEdit === true">

    <a-drawer
      title="Change password:"
      :placement="'right'"
      :closable="true"
      @close="userDataEditPassword = false"
      :visible="userDataEditPassword"
      width="50%">

      <div>

        <h5>Old password:</h5>
        <a-input
          v-model="oldPassword"
          class="passwordEditInput"
          type="password"
          v-if="!showOldPassword"
          v-autofocus>
        </a-input>
        <a-input
          v-model="oldPassword"
          class="passwordEditInput"
          v-if="showOldPassword">
        </a-input>
        <a-icon type="eye" v-if="!showOldPassword" @click="showOldPassword = !showOldPassword"/>
        <a-icon type="eye-invisible" v-if="showOldPassword" @click="showOldPassword = !showOldPassword"/>

          <h5>New password:</h5>
        <a-input
          v-model="newPassword1"
          class="passwordEditInput"
          v-if="showNewPassword">
        </a-input>
        <a-input
          v-model="newPassword1"
          class="passwordEditInput"
          type="password"
          v-if="!showNewPassword">
        </a-input>
        <a-icon type="eye" v-if="!showNewPassword" @click="showNewPassword = !showNewPassword"/>
        <a-icon type="eye-invisible" v-if="showNewPassword" @click="showNewPassword = !showNewPassword"/>

          <h5>Confirm password:</h5>
        <a-input
          v-model="newPassword2"
          class="passwordEditInput"
          v-if="showNewPassword">
        </a-input>
        <a-input
          v-model="newPassword2"
          class="passwordEditInput"
          type="password"
          v-if="!showNewPassword">
        </a-input>
        <a-icon type="eye" v-if="!showNewPassword" @click="showNewPassword = !showNewPassword"/>
        <a-icon type="eye-invisible" v-if="showNewPassword" @click="showNewPassword = !showNewPassword"/>

        <a-button block size="small" @click="genNewPW">Generate password</a-button>
        <br>
        <br>

        <!-- <span>Send new password:</span>
        <a-switch defaultChecked v-model="sendPasswordMail">
          <a-icon type="mail" slot="checkedChildren"/>
          <a-icon type="close" slot="unCheckedChildren"/>
        </a-switch>
        <br>
        <br> -->


        <a-button block type="primary" size="large" @click="saveNewPW">Save</a-button>

      </div>

    </a-drawer>


    </div>
      <!-- Status Posts -->
      <div v-if="userDataEdit === false">
        <h2 style="margin-top:1em;">Timeline: </h2>
        <section class="timeline">
          <a-timeline v-for="(post, _id) in userposts" :key="_id">
             <a-timeline-item>
               <div v-if="post.author === authUser.username">
                 <a-tag @click="removePost(post)" color="#845050" style="float:right;margin:0.25em;"><a-icon type="delete"/></a-tag>
                 <a-tag @click="notWorkingMessage()" color="#424e60" style="float:right;margin:0.25em;"><a-icon type="edit"/></a-tag>
               </div>
               <div v-else>
                 <a-tag @click="notWorkingMessage()" color="#AD4E42" style="float:right;margin:0.25em;"><a-icon type="dislike"/></a-tag>
                 <a-tag @click="notWorkingMessage()" color="#5CA157" style="float:right;margin:0.25em;"><a-icon type="like"/></a-tag>
               </div>
               <div style="float:right;">
                 <span style="color:#4e4e4e;font-size:10px;margin-right:1em;float:right;">{{ post.time }}</span><br>
                 <span style="color:#4e4e4e;font-size:10px;margin-right:1em;float:right;">{{ post.author }}</span>
               </div>
               <span style="white-space:pre-line;color:#2e2e2e;">{{ post.text }}</span>
               <a-divider/>
             </a-timeline-item>

          </a-timeline>
        </section>
      </div>

    </section>

  </section>
</template>





<script>
import { mapState } from 'vuex';
import moment from 'moment';

// Set locale
moment.locale('de')

export default {
  data() {
    return {
      isReady: false,
      userDataEdit: false,
      userDataEditPassword: false,
      sendPasswordMail: false,
      showOldPassword: false,
      showNewPassword: false,
      oldPassword: '',
      newPassword1: '',
      newPassword2: '',
      user: {},
      userData: {},
      userItems: [],
      newPost: '',
      userPosts: []
    }
  },
  async mounted() {
    let userData = await this.$getDoc(this.$route.params.id, 'userdata');
    if (!userData) {
      isReady = false;
      this.$message.error(`Error: User ${this.$route.params.id} not found.`);
    }
    this.userData = userData;
  },
  methods: {
    // Update Userdata
    async saveData() {
      try {
        // Predefine User Data
        let data = {
          _id: this.authUser.username,
          _rev: this.userData._rev,
          surname: this.userData.surname,
          lastname: this.userData.lastname,
          displayname: this.userData.displayname,
          email: this.userData.email,
          phone: this.userData.phone,
          headerImage: this.userData.headerImage,
          profileImage: this.userData.profileImage,
          kontaktListen: this.userData.kontaktListen,
          kontaktFavoriten: this.userData.kontaktFavoriten
        }
        // Update in Database
        await this.$putDoc(data, data._id, data._rev, 'userdata')
        // Fetch back User Data
        this.userData = await this.$getDoc(this.$route.params.id, 'userdata')
        this.$message.success('Saved!');
        this.userDataEdit = false;
      } catch (err) {
        this.$message.error(`Error while saving!`);
      }
    },
    // Post
    async post() {
      try {
        // Predefine Post for Database
        let post = {
          author: this.authUser._id,
          text: this.newPost,
          time: moment().format('LLLL')
        }
        await this.$postDoc(post, 'userposts', post.author)
        this.$message.success('Posted!');
      } catch (err) {
        this.$message.error(`Error while posting`);
      }
      // Fetch Posts for User
      this.userPosts = this.$store.state.userposts.filter(p => p.author === this.authUser._id)
      this.newPost = ''
    },
    // Remove Post
    async removePost(data) {
      try {
        // Delete Post in Database
        await this.$remDoc(data, 'userposts')
        this.$message.success('Post deleted!');
        // Fetch Posts for User
        this.userPosts = this.$store.state.userposts.filter(p => p.author === this.authUser._id)
      } catch (err) {
        this.$message.error(`Error while deleting!`);
      }
    },
    genNewPW() {
      const newpw = this.$randomString(4);
      this.newPassword1 = newpw;
      this.newPassword2 = newpw;
    },
    async saveNewPW() {
      try {
        if (!this.oldPassword) {
          throw new Error(`Please enter your old password!`);
        };
        if (!this.newPassword1 || !this.newPassword2) {
          throw new Error(`Please confirm the new password!`);
        };
        // Get complete User
        const user = await this.$getDoc(this.authUser.username, 'user');
        // Test old Password
        const res = await this.$checkPassword(user, this.oldPassword);
        // Set new Password
        if (this.newPassword1 === this.newPassword2) {
          this.$newPassword(user, this.newPassword2);
        } else {
          throw new Error(`Password did not match!`);
        }
        if (res) {
          // Send new Password to users eMail
          if (this.sendPasswordMail === true) {
            await this.$sendMail(this.userData.email, 'Password was reset!', `Your new password: ${this.newPassword2}`);
          }
          this.userDataEdit = false;
          this.userDataEditPassword = false;
          this.oldPassword = '';
          this.newPassword1 = '';
          this.newPassword2 = '';
          // this.sendPasswordMail = true;
          this.showOldPassword = false;
          this.showNewPassword = false;
          this.$message.success(`Password saved!`);
        }
      } catch (err) {
        this.$message.error(`${err}`)
      }
    },
    cancelAndReset() {
      this.userDataEdit = false;
      this.userDataEditPassword = false;
      this.oldPassword = '';
      this.newPassword1 = '';
      this.newPassword2 = '';
      // this.sendPasswordMail = true;
      this.showOldPassword = false;
      this.showNewPassword = false;
    },
    notWorkingMessage() {
      // PopUp accomplished
      this.$notification['error']({
        message: 'Placeholder!',
        description: 'Only deleting works at the moment!',
      });
    }
  },
  computed: {
    ...mapState(['authUser', 'userposts'])
  }
}



</script>
<style>

.userHeader {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: #2e2e2e;
  height: 14em;
  min-width: 100%;
  max-width: 100%;
  background-position: center top;
  background-repeat: no-repeat;
  background-size: cover;
}

.avatarProfileCenter {
  margin-top: 2em;
  width: 17.5em;
  border-radius: 50%;
  cursor: pointer;
}

#userName {
  text-align: center;
  font-size: 38px;
  margin-top: 0.25em;
  color: #2e2e2e;
}

.passwordEditInput {
  margin-bottom: 1em;
  width: 90%;
  margin-right: 0.75em;
}

.userInfo {
  display: flex;
  flex-direction: row;
  height: auto;
  padding: 2em;
}

.left {
  line-height: 210%;
  flex-basis: 0;
  flex-grow: 1;
}

.right {
  padding-left: 2em;
  line-height: 200%;
  flex-basis: 0;
  flex-grow: 1;
}

.status {
  flex-basis: 0;
  flex-grow: 4;
  padding: 1em;
}



.inputInfo {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}



.timeline {
  background-color: #f4f4f4;
  padding: 2em 20% 0 20%;
}

#thisButtons {
  margin: 0.5em;
  float: right;
}



.genUserData {
  font-size: 22px;
}

</style>
