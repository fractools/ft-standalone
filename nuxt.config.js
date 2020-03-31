const bodyParser = require('body-parser')
const session = require('express-session')

const pkg = require('./package')

module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#6F6F80' },

  /*
  ** Global CSS
  */
  css: [
    '@/assets/css/main.css',
    'ant-design-vue/dist/antd.css',
    {
      src: '@/assets/style/main.less',
      lang: 'less'
    }
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/antd-ui.js', ssr: false },
    { src: '~/plugins/resolve-id.js', ssr: false },
    { src: '~/plugins/resolve-value.js', ssr: false },
    { src: '~/plugins/idGenerator', ssr: false },
    { src: '~/plugins/pouchsocket', ssr: false },
    { src: '~/plugins/vue-autofocus.js', ssr: false },
    { src: '~/plugins/vue-gallery.js', ssr: false }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    // '@nuxtjs/tailwindcss',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/markdownit',
    '@nuxtjs/pwa'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  markdownit: {
    injected: true
  },
  router: {
    // middleware: 'auth'
  },
  serverMiddleware: [
    // body-parser middleware
    bodyParser.json(),
    // session middleware
    session({
      secret: 'super-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 10000000 }
    }),
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    },
    loaders: {
      less: { javascriptEnabled: true }
    }
  }
}
