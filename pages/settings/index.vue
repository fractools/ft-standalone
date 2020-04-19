<template>
  <section>
    <a-tabs defaultActiveKey="1" size="large" id="settingsTabContainer">
      <a-tab-pane key="1">
        <span slot="tab">
          <a-icon type="file-text" />
          Logs
        </span>
        <Systemlogs/>
      </a-tab-pane>
      <a-tab-pane key="2">
        <span slot="tab">
          <a-icon type="user" />
          User
        </span>
        <UserManager/>
      </a-tab-pane>
      <a-tab-pane key="3">
        <span slot="tab">
          <a-icon type="cloud-upload" />
          Files
        </span>
        <FileManager/>
      </a-tab-pane>
      <a-tab-pane key="4">
        <span slot="tab">
          <a-icon type="database" />
          Database
        </span>
        <section style="padding: 2em;">
          <a-divider class="dividerUserList" orientation="left"><h2>Datenbanken</h2></a-divider>
          <DbManager/>
        </section>
      </a-tab-pane>
      <img src="~/assets/pictures/layout/logo.png"
           style="width:12em;cursor:pointer;margin-right:0.5em;"
           slot="tabBarExtraContent"
           @click="$router.push('/')">
    </a-tabs>

  </section>
</template>
<script>
import DbManager from '~/components/settings/DbManager'
import Systemlogs from '~/components/settings/Systemlogs'
import UserManager from '~/components/settings/UserManager'
import FileManager from '~/components/settings/FileManager'


export default {
  middleware: 'authAdmin',
  components: {
    Systemlogs,
    DbManager,
    UserManager,
    FileManager
  }
}

</script>
<style>
#settingsTabContainer {
  animation: 0.5s appear;
  background: #2e2e2e;
  min-height:100vh;
}
.ant-tabs-bar {
  margin: 0;
}
@keyframes appear {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
