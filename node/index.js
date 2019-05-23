const fs = require('fs')
const path = require("path") 
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
const jwt = require('jsonwebtoken')


//设置允许跨域访问该服务.
// app.all('*', function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*')
//   //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
//   res.header('Access-Control-Allow-Headers', 'Content-Type')
//   res.header('Access-Control-Allow-Methods', '*')
//   res.header('Content-Type', 'application/json;charset=utf-8')
//   next()
// })

//token验证方法
const verifyToken = token => {
  const cert = fs.readFileSync(path.join(__dirname, './public.key')) //公钥
  let ret = {}
  try {
    let result = jwt.verify(token, cert, {algorithms: ['RS256']}) || {}
    let { exp = 0 } = result
    
    let current = Date.now()
    if( current <= exp ) {
      ret = result.data || {}
    }
  } catch(e) {
  
  }
  return ret
}

//全局拦截器
app.all( '/*', async ( req, res, next ) => {
  //如果是 /login 或者 /register 不用校验 token
  let { url = '' } = req
  if(url.indexOf('/login') > -1 || url.indexOf('/register') > -1) {
    await next()
  } else {
    let token = req.headers.token || ''
    if(token) {
      let ret = verifyToken(token)
      let { account } = ret
      if(account) {
        await next()
      } else {
        res.status(401).send({
          message:'身份已过期'
        })
      }
    } else {
      res.status(401).send({
        message:'身份已过期'
      })
    }
  }
})

//route
const register = require('./route/register')
const login = require('./route/login')

app.use('/', register)
app.use('/', login)


//监听3000端口
app.listen(3001)

//服务运行之后输出一行信息
console.log('Server running at http://127.0.0.1:3001')