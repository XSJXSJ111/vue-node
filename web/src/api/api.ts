import Vue from 'vue'
import axios from 'axios'
import store from '../store'

const ajaxUrl = 'http://localhost:3000/api'
  
let ajax = axios.create({
  baseURL: ajaxUrl,
  timeout: 30000
})

ajax.defaults.headers.common = {
  'X-Requested-With': 'XMLHttpRequest'
}

//请求预处理
ajax.interceptors.request.use(config => {
  let token = Vue.ls.get('token') || ''
  let { headers } = config
  headers = { ...headers, token }
  config = { ...config, headers }
  return config
}, error => {
  return Promise.reject(error)
});

//统一报错提示
ajax.interceptors.response.use(response => {
  store.commit('setBtnLoad', false)
  console.log('请求返回',response)
  return response
}, error => {
  store.commit('setBtnLoad', false)
  let response = error.response
  console.log('请求错误',response)
  Vue.prototype.$Message.error(response.data.message)
  return Promise.reject(response)
})

// 通过Proxy代理来封装api
// const api = new Proxy({}, {
//   get(target, prop) {
//     const method = /^[a-z]+/.exec(prop)[0];
//     const path = '/' + prop
//       .substring(method.length)
//       .replace(/([a-z])([A-Z])/g, '$1/$2')
//       .replace(/\$/g, '/$/')
//       .replace(/\/$/g, '')
//       .toLowerCase();
//     return(...args) => {
//       const url = path.replace(/\$/g, () => args.shift());
//       const options = args.shift() || {};
//       //console.log('Requesting: ', method, url, options);
//       return ajax({
//         method,
//         url,
//         ...options
//       });
//     }
//   }
// })

//封装请求方法
const request = {
  post(url:string, data:object = {}) {
    return ajax({
      method: 'post',
      url,
      data
    })
  },
  get(url:string, params:object = {}) {
    return ajax({
      method: 'get',
      url,
      params
    })
  }
}


//api接口封装
const api = {
  //注册
  register(data:object = {}) {
    return request.post('/register', data)
  },
  //登录
  login(data:object = {}) {
    return request.post('/login', data)
  }
}

export default api