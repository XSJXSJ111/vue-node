const fs = require("fs")
const path = require("path") 
const express = require('express')
const router  = express.Router()
const mysql   = require('../mysql/mysql')
const jwt = require('jsonwebtoken')

router.post('/login', async (req, res) => {
  console.log('登陆了')
  

  const { account, password } = req.body

  let sql = `SELECT * FROM user where account = '${account}'`
  let ret = await mysql.connect(sql)
  
  if(!ret.length) {
    res.status(403).send({
      message:'账号不存在'
    })
    return false
  } else {
    if(ret[0].password != password) {
      res.status(403).send({
        message:'账号不存在或密码错误'
      })
      return false
    }
  }

  //生成token
  let created = Date.now()
  const data = {
    id:ret[0].id,
    userName: ret[0].user_name,
    account: ret[0].account
  }
  
  const cert = fs.readFileSync(path.join(__dirname, "../private.key"))
  const token = jwt.sign({
    data,
    exp: created + 3600 * 1000 * 720 //过期时间 30天
  }, cert, { algorithm: 'RS256' })
  
  res.status(200).send({
    token,
    message:'登录成功'
  })
})

module.exports = router