<template>
  <section>
    <div>
      <a-input placeholder="Datenbank-Name" @keyup.enter="postDB()" v-model="dbname"/>
    </div>
    <div style="padding: 0.5em 0 1em 0;">
      <a-button type="primary" block @click="postDB()">Save</a-button>
    </div>
    <div>
      <a-table :columns="cols" :dataSource="$store.state.databases" :locale="{ emptyText: 'No records' }" rowKey="_id" bordered>
        <template slot="name" slot-scope="text, record, index">
          {{ record.dbname }}
        </template>
        <template slot="author" slot-scope="text, record, index">
          {{ record.author }}
        </template>
        <template slot="delete" slot-scope="text, record, index">
          <a-button @click="remDB(record)" type="danger"><a-icon type="delete"/></a-button>
        </template>
      </a-table>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      database: 'databases',
      cols: [{
        title: 'Name',
        dataIndex: 'name',
        scopedSlots: { customRender: 'name' },
      }, {
        title: 'User',
        dataIndex: 'author',
        scopedSlots: { customRender: 'author' },
      }, {
        title: 'Actions',
        dataIndex: 'delete',
        scopedSlots: { customRender: 'delete' },
      }],
      dbname: '',
    }
  },
  methods: {
    async postDB () {
      const db = {
        author: this.$store.state.authUser.username,
        dbname: this.dbname
      }
      try {
        await this.$postDB(db, db.author)
        this.$message.success(`"${this.dbname}" was saved!`, 10)
      } catch (err) {
        this.$message.error(`Fehler: ${err}`)
      }
      this.dbname = ''
    },
    async remDB (obj) {
      try {
        await this.$remDoc(obj, this.database)
        this.$message.success(`"${obj.dbname}" was deleted!`, 10)
      } catch (err) {
        this.$message.error(`Error: ${err}`)
      }
    }
  },
}
</script>

<style>



</style>
