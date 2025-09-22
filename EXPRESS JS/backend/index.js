const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send(
    '<h1>Selamat Datang</h1><br>' +
    '<h2>Website PBL</h2>' +
    '<h3>Web Developer dengan NodeJs dan React</h3>'
  )
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
