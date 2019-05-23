const mysql = require('mysql')

exports.connect = (sql, params=[]) => {
  return new Promise((resolve,reject) => {
    //连接数据库
    const connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : '123456',
      database : 'test'
    })
    connection.connect()

    console.log('连接数据库成功')
    connection.query(sql, params, (err, res) => {
      if(err) {
        console.log('[SELECT ERROR] - ', err.message)
        reject(err)
      } else {
        resolve(res)
      }
    })

    connection.end()
    console.log('关闭数据库连接')
  })
  
}