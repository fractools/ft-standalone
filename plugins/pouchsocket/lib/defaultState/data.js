export default {
  databases: [
    {
      _id: new Date() + Math.random().toString(36).substr(2, 9),
      author: 'InitImport',
      dbname: 'filesdb'
    },
    {
      _id: new Date() + Math.random().toString(36).substr(2, 9),
      author: 'InitImport',
      dbname: 'logs'
    },
    {
      _id: new Date() + Math.random().toString(36).substr(2, 9),
      author: 'InitImport',
      dbname: 'userdata'
    },
    {
      _id: new Date() + Math.random().toString(36).substr(2, 9),
      author: 'InitImport',
      dbname: 'userposts'
    }
  ],
  logs: [],
  user: [],
  userdata: [],
  userposts: [],
  filesdb: []
};
