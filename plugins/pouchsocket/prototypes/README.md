# Upload Prototypes

## PDF Upload
> Destination on Fileserver is `/uploads/pdf/`

```javascript
function () {
  // Defining Upload Paramter via data().return`
  let dest = this.dest
  let file = this.file
  // Upload
  this.$pdfUpload(file, dest);
},
```

## General File Upload
> Destination on Fileserver is `/uploads/`

```javascript
function () {
  // Defining Upload Paramter via `data().return`
  let dest = this.dest
  let file = this.file
  // Upload
  this.$upload(file, dest);
},
```

# PouchDB Prototypes

> Snippets are Nuxt specific, so `this.` before `$prototype` is needed, if used in `methods`-Section
> `this.$prototype('Parameter')`

## Preparing

### Client

Define Database in every Page or Component for dynamic access. In most cases you need prepared Data via `export default`.

For Realtime Socket Functionality, we need to define `beforeMount`.
> Will be replaced in the future!

```javascript
import socket from '~/plugins/socket.io'
const database = 'DatabaseName'

export default {
  data() {
    return {
      id: '',         // Later Need for Getting specific Document
      documents: [],  // Array for fetched Documents
      document: ''    // Content for document for Post or Update
    }
  },
  async beforeMount() {
    socket.on(`new-${database}`, (document) => {
      this.documents.push(document)
    })
    socket.on(`updated-${database}`, (document) => {
      let l = [];
      l.push(document);
      const docs = this.documents.map(obj => l.find(o => o._id === obj._id) || obj);
      this.documents = docs;
    })
    socket.on(`removed-${database}`, (obj) => {
      const docs = this.documents.filter(v => v._id != obj._id);
      this.documents = docs;
    })
  },
}
// ...
// methods: {
// ...
```

### Server

Duplicate Module `/server/sockets/documents.js` and rename it like you database names


---



## Methods

### Fetch All Docs

```javascript
// If you want to prefetch before Rendering otherwise replace `mounted` with `function`
async mounted () {
  this.documents = await this.$fetchAllDocs(`${database}`)
}
```



### Fetch Single Doc

```javascript
async function () {
  let id = this.id
  let doc = await this.$getDoc(id, `${database}`)
  // Handle 'doc'
}
```



### Post Single Doc

```javascript
function () {
  // Predefine Object
  const document = {
    author: this.authUser.username, // genHub specific design User > No need to change
    date: new Date().toJSON(),
    // Customize everything below to your needs
    text: this.document.trim()
  }
  this.$postDoc(document, `${database}`, document.author)
}
// If you need to reset Input
// this.document = ''
```



### Update Single Doc

The updating Content/Text via `input` & `v-model` shall be `this.document.content`


```javascript
function (doc) {
  // Predefine Object
  const document = {
    author: this.authUser.username,
    date: new Date().toJSON(),
    text: doc.content.trim()
  }

  const id = doc._id
  const rev = doc._rev
  // Update Doc in Documents
  this.$putDoc(document, id, rev, `${database}`)
  // Clear Input
  this.document = ''
}
```



### Remove Single Document

```javascript
function (doc) {
  this.$remDoc(doc, `${database}`)
  const docs = this.documents.filter(v => v._id !== obj._id);
  this.documents = docs;
}
```

### Trigger manual single Replication

```javascript
$replicate(`${database}`)
```
