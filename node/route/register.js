const fs = require("fs")
const path = require("path") 
const express = require('express')
const router  = express.Router()
const mysql   = require('../mysql/mysql')
const jwt = require('jsonwebtoken')
const { getUuid } = require('../libs/util')

router.post('/register', async (req, res) => {
  console.log(`url：/register,method：post，参数：${req.body}`)

  //校验参数
  const { account, password } = req.body
  if(!account || !password) {
    res.status(403).send({
      message:'账号或密码不能为空'
    })
    return false
  }

  //校验用户是否已存在
  let hadSql = `SELECT * FROM user where account = '${account}'`
  let had = await mysql.connect(hadSql)
  if(had.length) {
    res.status(403).send({
      message:'用户已存在'
    })
    return false
  }

  let addSql = 'INSERT INTO user(user_name,account,password) VALUES(?,?,?)'
  let addSqlParams = [getUuid(), account, password]

  let ret = await mysql.connect(addSql, addSqlParams)

  let user = await mysql.connect(hadSql)
  //生成token
  let created = Date.now()
  const data = {
    id:user[0].id,
    userName: user[0].user_name,
    account: user[0].account
  }
  const cert = fs.readFileSync(path.join(__dirname, "../private.key"))
  const token = jwt.sign({
    data,
    exp: created + 3600 * 1000 * 720 //过期时间 30天
  }, cert, { algorithm: 'RS256' })

  res.status(200).send({
    token,
    message:'注册成功'
  })
})

module.exports = router