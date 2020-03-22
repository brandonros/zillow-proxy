const express = require('express')
const proxy = require('express-http-proxy')
const cors = require('cors')
const fs = require('fs')

const db = JSON.parse(fs.readFileSync('db.json').toString())

const apiApp = express()
apiApp.use(cors())
apiApp.use(express.json())
apiApp.get('/', (req, res, next) => {
  res.send(fs.readFileSync('index.html').toString())
})
apiApp.get('/listing', (req, res, next) => {
  const { address } = req.query
  res.send(db[address] || {
    choice: null,
    notes: ''
  })
})
apiApp.put('/listing', (req, res, next) => {
  const { address, choice, notes } = req.body
  db[address] = {
    choice,
    notes
  }
  fs.writeFileSync('db.json', JSON.stringify(db))
  res.status(204).end()
})
apiApp.listen(9090, () => console.log('Listening...'))
const proxyApp = express()
proxyApp.use('/', proxy('https://www.zillow.com/', {
  userResHeaderDecorator: (headers) => {
    console.log(headers)
    headers['x-frame-options'] = ''
    headers['content-security-policy'] = ''
    return headers
  }
}))
proxyApp.listen(9091, () => console.log('Listening...'))
