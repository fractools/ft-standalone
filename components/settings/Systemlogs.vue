<template>
  <section>
    <a-table :columns="columns" :dataSource="reversedLogs" :pagination="pagination" :locale="{ emptyText: 'No records' }" rowKey="_id" class="darkTable"/>
  </section>
</template>

<script>
import { mapState } from 'vuex'

const columns = [
    {
      title: 'Time',
      dataIndex: 'time',
      // specify the condition of filtering result
      // here is that finding the name started with `value`
      sorter: (a, b) => new Date(a.time) - new Date(b.time),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Label',
      dataIndex: 'label',
      onFilter: (value, record) => record.label.indexOf(value) === 0,
      filters: [
        {
          text: 'Node Core',
          value: 'Node Core',
        },
        {
          text: 'Socket',
          value: 'Socket',
        },
        {
          text: 'Authentification',
          value: 'Authentification'
        },
        {
          text: 'Database',
          value: 'Database'
        },
        {
          text: 'Documents',
          value: 'Documents'
        },
        {
          text: 'Fileserver',
          value: 'Fileserver'
        },
        {
          text: 'Nodemailer',
          value: 'Nodemailer'
        },
        {
          text: 'User Management',
          value: 'User Management'
        }
      ],
    },
    {
      title: 'Level',
      dataIndex: 'level',
      filters: [
        {
          text: 'Info',
          value: 'info',
        },
        {
          text: 'Error',
          value: 'error',
        },
      ],
      onFilter: (value, record) => record.level.indexOf(value) === 0,
    },
    {
      title: 'Message',
      dataIndex: 'message'
    },
    {
      title: 'User',
      dataIndex: 'user',
      filters: [],
      onFilter: (value, record) => record.user.indexOf(value) === 0,
    },
    {
      title: 'Socket ID',
      dataIndex: 'socketid'
    }
  ];

export default {
  data() {
    return {
      columns,
      tableRenderKey: 0,
      pagination: {
        defaultPageSize: 100
      }
    }
  },
  async mounted() {
    const uniqueLogUsers = [...new Set(this.logs.map(item => item.user))];
    for (let user of uniqueLogUsers) {
      this.columns[4].filters.push({
        text: user,
        value: user,
      });
    };
  },
  computed: {
    reversedLogs() {
      let logs = [];
      if (this.logs) {
        logs = [...this.logs];
      }
      return logs.reverse();
    },
    ...mapState(['logs'])
  }
}
</script>

<style>
</style>
