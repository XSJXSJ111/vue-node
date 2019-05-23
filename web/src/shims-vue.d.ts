import Vue from 'vue'
//import VueLocalStorage from 'vue-ls'

declare module '*.vue' {
  //import Vue from 'vue'
  export default Vue
}

declare module 'vue/types/vue' {
  interface VueConstructor {
    ls: any
  }
}
