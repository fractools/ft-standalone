<template>
  <section>
    <div class="serManagement">
      <section class="newUser">
        <a-divider class="dividerUserList" orientation="left"><h2>Benutzer</h2></a-divider>
        <section class="newUserData">

          <!-- General Data - Login -->
          <div class="genData">
            <a-divider orientation="left"><h3>Login</h3></a-divider>
            <a-input
              placeholder="Username"
              v-model="newUser.username"
              class="withGap">
            <a-icon
              slot="prefix"
              type="user"/>
            </a-input>

            <a-input
              placeholder="Password"
              v-model="newUser.password"
              class="withGap">
              <a-icon
              slot="prefix"
              type="lock"/>
            </a-input>
          </div>

          <!-- Personal Data -->
          <div class="persoData">
            <a-divider orientation="left"><h3>Persönliche Daten</h3></a-divider>
            <a-input
            style:="padding-top: 1em;"
            class="withGap"
            placeholder="Surname"
            v-model="newUserData.surname"/>
            <a-input
            style:="padding-top: 1em;"
            class="withGap"
            placeholder="Lastname"
            v-model="newUserData.lastname"/>
            <a-input
            style:="padding-top: 1em;"
            class="withGap"
            placeholder="E-Mail-Adresse"
            v-model="newUserData.email"/>
            <a-input
            style:="padding-top: 1em;"
            class="withGap"
            placeholder="Telefonnummer"
            v-model="newUserData.phone"/>
          </div>
        </section>


        <!-- Role -->
        <a-divider orientation="left"><h3>Rolle</h3></a-divider>
        <div class="roleData">
          <a-radio-group
            style="width:100%;display:flex;flex-wrap:wrap;"
            v-model="newUser.role"
            class="withGap"
            buttonStyle="solid">
              <a-radio-button
                style="min-width:15em;flex-grow:1;flex-basis:0;"
                value="Administrator">
                <p style="text-align: center;">Administrator</p>
              </a-radio-button>
              <a-radio-button
                style="min-width:15em;flex-grow:1;flex-basis:0;"
                value="Benutzer">
                <p style="text-align: center;">Benutzer</p>
              </a-radio-button>
          </a-radio-group><br>
        </div>


        <!-- Add User Button -->
        <a-button
          block
          type="primary"
          @click="addUser"
          class="withGap">
          Benutzer anlegen
        </a-button>
      </section>

      <section class="gap">
        <!-- Just a Gap -->
      </section>

      <!-- Userlist  ########################################################################  SECTION -->
      <section class="userList">
        <a-divider class="dividerUserList" orientation="left"><h2>Benutzer Liste</h2></a-divider>

        <!-- new Table -->
        <a-table :columns="usersColumns" :dataSource="users" :locale="{ emptyText: 'Keine Einträge' }" rowKey="_id" bordered>
          <template
            v-for="col in
            [
            'username',
            'password',
            'role',
            ]"
            :slot="col"
            slot-scope="text, record, index">
          <div :key="col">
            <a-input
              v-if="record.editable"
              style="margin: -5px 0"
              :value="text"
              @change="e => handleChangeUser(e.target.value, record.username, col)"/>
            <template v-else>{{ text }}</template>
          </div>
        </template>
        <template slot="delete" slot-scope="text, record, index">
          <div class='editable-row-operations'>
            <span v-if="record.editable">
              <a-button @click="removeUser(record.username)" type="danger"><a-icon type="delete"/></a-button>
              <a-button @click="saveUser(record.username)">Save</a-button>
              <a-button @click="cancelUser(record.username)"><a-icon type="close-circle"/></a-button>
            </span>
            <span v-else>
              <a @click="editUser(record.username)">Bearbeiten</a>
            </span>
          </div>
        </template>
        <template slot="password" slot-scope="text, record, index">
          <a-button @click="newPassword(record._id)">Zurücksetzen</a-button></p>
        </template>
        </a-table>

      </section>

    </div>
  </section>
</template>

<script>
import PouchDB from 'pouchdb';
import { mapState } from 'vuex';

// Collumns for Userlist Table
const usersColumns = [{
  title: 'Benutzer',
  dataIndex: 'username',
  scopedSlots: { customRender: 'username' },
},{
  title: 'Rolle',
  dataIndex: 'role',
  scopedSlots: { customRender: 'role' },
},{
  title: 'Password',
  dataIndex: 'password',
  scopedSlots: { customRender: 'password' },
},{
  title: 'Aktionen',
  dataIndex: 'delete',
  scopedSlots: { customRender: 'delete' },
}];

// User and UserData Array for fetch User from Database
const users = [];
const usersData = [];

export default {
  data() {
    this.cacheData = users.map(item => ({ ...item }));
    return {
      usersColumns,
      pagination: {},
      users: [],
      usersData: [],
      newUser: {},
      newUserData: {},
      newUserCol: {},
      newUserDataCol: {}
    }
  },
  //  FetcusersDatah User Database
  async mounted() {
    try {
      // Fetch User
      this.users = await this.$fetchAllDocs('user');
      // Fetch UserData
      this.usersData = await this.$fetchAllDocs('userdata');
    } catch (err) {
      this.$message.error(`Fehler beim Laden der Benutzer`);
    }
  },
  methods: {
    handleChangeUser (value, key, column) {
      const newData = [...this.users];
      const target = newData.filter(item => key === item.username)[0];
      if (target) {
        target[column] = value
        this.users = newData
      }
    },

    editUser (key) {
      const newData = [...this.users];
      const target = newData.filter(item => key === item.username)[0];
      if (target) {
        target.editable = true
        this.users = newData
        this.newUserCol = target
      }
    },

    async saveUser (key) {
      const newData = [...this.users];
      try {
        let obj = {
          _id: this.newUserCol._id,
          _rev: this.newUserCol._rev,
          username: this.newUserCol.username,
          password: this.newUser.password,
          token: this.newUserCol.token,
          role: this.newUserCol.role
        };
        await this.$putDoc(obj, obj._id, obj._rev, 'user');
        this.$message.success('Benutzerdaten gespeichert!');
        this.users = await this.$fetchAllDocs('user');
        this.userData = await this.$fetchAllDocs('userdata');
        this.userDataEdit = false;
        this.record = null;
      } catch (err) {
        this.$message.error(`Fehler beim Speichern der Benutzerdaten`);
      }
      this.cancel(key);
    },

    cancelUser (key) {
      const newData = [...this.users];
      const target = newData.filter(item => key === item.username)[0];
      if (target) {
        Object.assign(target, this.cacheData.filter(item => key === item.username)[0]);
        delete target.editable;
        this.users = newData;
        this.newUserCol = {};
        this.record = null;
      }
    },

    async addUser() {
      try {
        // User Credentials
        const user = {
          _id: this.newUser.username.toLowerCase(),
          username: this.newUser.username.toLowerCase(),
          password: this.newUser.password,
          role: this.newUser.role
        }
        // UserData
        const userData = {
          _id: this.newUser.username.toLowerCase(),
          displayname: this.newUserData.surname,
          surname: this.newUserData.surname,
          lastname: this.newUserData.lastname,
          email: this.newUserData.email,
          phone: this.newUserData.phone,
          profileImage: 'http://genratio.de/wp-content/uploads/2019/04/DefaultAvatarZero700px.png',
          kontaktFavoriten: [],
          kontaktListen: []
        }
        // Merge User Informations
        const fullUser = {
          user,
          userData
        }
        // Register new User into Database via Socket
        let reg = await this.$addUser(fullUser);
        // Finish Adding Process
        this.newUser = {}
        this.newUserData= {}
        // Fetch new Data
        this.users = await this.$fetchAllDocs('user')
        this.usersData = await this.$fetchAllDocs('userdata')
        this.$message.success('Benutzer wurde angelegt')
      } catch (err) {
        // console.log(err);
        this.$message.error(`Fehler beim Anlegen des Benutzers`);
      }
    },


    async removeUser(key) {
      const newData = [...this.users]
      try {
        // User Credentials
        await this.$remDoc(this.newUserCol, 'user');
        // UserData
        await this.$remDoc(this.newUserCol, 'userdata');
        // Fetch new Data
        this.users = await this.$fetchAllDocs('user')
        this.usersData = await this.$fetchAllDocs('userdata')
        // Finish Removing User
        this.record = null;
        this.$message.success('Benutzer gelöscht!');
      } catch (err) {
        this.$message.error(`Fehler beim Löschen des Benutzers`);
      }
    },

    async newPassword(key) {
      // Get current User
      const user = this.users.filter(item => key === item._id)[0];
      const userdata = this.usersData.filter(item => key === item._id)[0];
      // Generate new Password
      const newpw = this.$randomString(4);
      this.$newPassword(user, newpw)
      // Send new Password to its User
      const text = `Dein neues Password: ${newpw}`
      try {
        let res = await this.$sendMail(userdata.email, 'Password Reset', text);
        this.$message.success('Neues Password an Benutzer versendet');
      } catch (err) {
        this.$message.error('Neues Password konnte nicht versendet werden')
      }
    }
  },
  computed: {
    ...mapState(['allUser', 'authUser', 'filesdb'])
  }
}
</script>

<style>
.gap {
  height: 20%;
  padding-top: 6em;
}

.withGap {
  margin: 10px 0 10px 0;
}

.userManagement {
  padding: 2em;
}

.userList {
  padding: 2em;
}

.newUser {
  padding: 2em;
}

.newUserData {
  display: flex;
  flex-direction: row;
}

.newUserData>* {
  flex: 1 1 80px;
}

.dividerUserList {
  padding: 0 0 2em 0  ;
}

.genUserData{
  width: 20%;
  flex-grow: 4;
  align-self: flex-start;
  padding-right: 2em;
}

.persoData {
  width: 80%;
  flex-grow: 2;
  align-self: flex-end;
  padding-left: 2em;
}

.roleData {
  width: 100%;
  padding-bottom: 6em;
}
</style>
