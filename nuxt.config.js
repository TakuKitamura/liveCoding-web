import colors from "vuetify/es5/util/colors";
import fs from "fs";

const envSet = require("./config.js");
const https = require("https");
https.globalAgent.options.ca = fs.readFileSync("cert.pem");

export default {
  env: {
    scheme: envSet.scheme,
    host: envSet.apiHost,
    apiPort: envSet.apiPort
  },
  server: {
    host: envSet.webHost,
    port: envSet.webPort,
    https: {
      key: fs.readFileSync(envSet.keyPath),
      cert: fs.readFileSync(envSet.certPath)
    }
  },

  mode: "universal",
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: "liveCoding",
    title: "liveCoding" || "",
    meta: [
      {
        charset: "utf-8"
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [
      {
        rel: "icon",
        type: "image/x-icon",
        href: "/favicon.ico"
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: "#fff"
  },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ["@nuxtjs/vuetify"],
  /*
   ** Nuxt.js modules
   */
  modules: [
    [
      "cookie-universal-nuxt",
      {
        parseJSON: false
      }
    ],
    "@nuxtjs/markdownit"
  ],
  markdownit: {
    injected: true, // $mdを利用してmarkdownをhtmlにレンダリングする
    // breaks: true, // 改行コードを<br>に変換する
    // html: false, // HTML タグを有効にする
    // linkify: true, // URLに似たテキストをリンクに自動変換する
    // typography: true, // 言語に依存しないきれいな 置換 + 引用符 を有効にします。
  },

  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
};
