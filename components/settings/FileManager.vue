<template>
  <section class="filemanager">

    <!-- Uploader -->
    <div class="uploaderFilmanagerPage">
      <a-divider orientation="left" class="dividerUserList"><h2 style="witdh: 100%;">Uploader</h2></a-divider>
      <section>
        <input type="file" id="file" ref="files" @change="handleFileUpload()" style="position:absolute;top:0;left:0;display:none;" multiple/>
        <a-button @click="$refs.files.click()" style="margin-top:0.5em;margin-bottom:0.5em;" block>Datei zum Upload auswählen</a-button>
        <h5 style="padding: 1em 0 1em 0;"><b>Pfad für Dateiupload: </b><em>(Tip: So werden neue Ordner und Unterordner angelegt: <b>'ordner/unterordner1/unterordner2'</b> Der erste und letzte Slash <b>/</b>  werden weggelassen.)</em></h5>
        <a-input v-model="path" class="inputCenter" placeholder="Pfad für Dateiupload"/>
        <a-button v-if="files && path" type="primary" style="margin-top:0.5em;margin-bottom:0.5em;" @click="submitFile()" block>Hochladen</a-button>
      </section>

      <!-- Progressbar for SHowing free Disk Space -->
      <div style="padding: 2em 2em 2em 0;">
        <h5>Free Disk Space</h5>
        <a-progress v-if="disk.percent < 4" :percent="disk.percent" strokeColor="red"/>
        <a-progress v-if="disk.percent < 10" :percent="disk.percent" strokeColor="orange"/>
        <a-progress v-else :percent="disk.percent" strokeColor="#6fff00"/>
      </div>
    </div>

    <!-- Filelist -->
    <section class="filelistFilmanagerPage">
      <a-divider orientation="left"><h2>Dateiliste</h2></a-divider>

      <a-table :columns="filesColumns" :dataSource="reversedFiles" :locale="{ emptyText: 'Keine Einträge' }" bordered>
        <template slot="filename" slot-scope="text, record, index">
          <a target="_blank" v-bind:href=' fileserver + record.path + "/" + record.filename '>{{ record.filename }}</a>
        </template>
        <template slot="delete" slot-scope="text, record, index">
          <a-button @click="removeFile(record)" type="danger"><a-icon type="delete"/></a-button>
        </template>
      </a-table>

    </section>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import pkg from '~/package'

// fileserver
const database = 'filesdb';
const fileserver = `http://${pkg.backend}/uploads/`;

// Collumns for Filelist Table
const filesColumns = [{
  title: 'Pfad',
  dataIndex: 'path',
  scopedSlots: { customRender: 'path' },
}, {
  title: 'Dateiname',
  dataIndex: 'filename',
  scopedSlots: { customRender: 'filename' },
}, {
  title: 'Datum',
  dataIndex: 'date',
  scopedSlots: { customRender: 'date' },
}, {
  title: 'Benutzer',
  dataIndex: 'author',
  scopedSlots: { customRender: 'author' },
},{
  title: 'Aktionen',
  dataIndex: 'delete',
  scopedSlots: { customRender: 'delete' },
}];

export default {
  data() {
    return {
      file: '',
      files: [],
      filename: '',
      path: '',
      disk: {
        free: 0,
        percent: 0,
        total: 0,
      },
      fileserver,
      database,
      filesColumns
    }
  },
  async mounted() {
    let diskData =  await this.$checkDiskspace();

    this.disk.free = diskData.freeGB;
    this.disk.percent = diskData.freePercent.toFixed(2);
    this.disk.total = diskData.total;

    if (diskData.freePercent <= 10) {
      this.$notification['warning']({
          duration: 0,
          message: 'Limited Disk Space Left',
          description:
            `The Disk is going to be full: ${diskData.freePercent.toFixed(2)}% left`,
      });
    };
  },
  methods: {

    // Upload Methods
    async submitFile(){
      let path = this.path,
          files = this.files;

      try {
        // Upload File to Fileserver
        await this.$upload(files, path, this.authUser.username);

        for (let file of files) {
          // Predefine Object
          const filedata = {
            author: this.authUser.username,
            date: new Date().toJSON(),
            filename: file.name.trim(),
            path
          };
          // Post in to DB via Socket
          await this.$postDoc(filedata, `${database}`, filedata.author);
        };
        this.$message.success('Dateien wurden erfolgreich hochgeladen')
      } catch (err) {
        this.$message.error(`Fehler: ${err}`);
      };

      // Clear Input
      this.files = [];
    },
    handleFileUpload(){
      // Handles a change on the file upload
      this.files = this.$refs.files.files;
    },

        // Table Methods
    handleChange (value, key, column) {
      const newData = [...this.files];
      const target = newData.filter(item => key === item.filename)[0];
      if (target) {
        target[column] = value;
        this.files = newData;
      }
    },
    edit (key) {
      const newData = [...this.files];
      const target = newData.filter(item => key === item.filename)[0];
      if (target) {
        target.editable = true;
        this.files = newData;
        this.fileCol = target;
      }
    },
    cancel (key) {
      const newData = [...this.files];;
      const target = newData.filter(item => key === item.filename)[0];;
      if (target) {
        // Object.assign(target, this.cacheData.filter(item => key === item.filename)[0])
        delete target.editable;;
        this.files = newData;;
        this.fileCol = {};
        this.record = null;
      }
    },
    async removeFile(obj) {
      let filename = obj.filename;
      let path = `${obj.path}/`;
      try {
        this.$removeFile(filename, path, this.authUser.username);
        await this.$remDoc(obj, `${database}`);
      } catch (err) {
        this.$message.error(`Fehler: ${err}`);
      }
      setTimeout(() => {
        this.files = this.$store.state.filesdb;
        this.filtered = this.filteredFiles();
      }, 1000);
    }
  },
  computed: {
    reversedFiles() {
      let files = [];
      if (this.filesdb) {
        files = [...this.filesdb];
      }
      return files.reverse();
    },
    ...mapState(['allUser', 'authUser', 'filesdb'])
  }
}
</script>

<style>
.filemanager {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}

.uploaderFilmanagerPage {
  width: 100%;
  padding: 2em;
}

.filelistFilmanagerPage {
  width: 100%;
  padding: 2em;
  margin: 2em;
}
</style>
