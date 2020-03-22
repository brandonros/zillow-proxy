const express = require('express')
const proxy = require('express-http-proxy')
const cors = require('cors')
const fs = require('fs')
// set up API
const apiApp = express()
apiApp.use(cors())
apiApp.use(express.json())
apiApp.put('/listing', (req, res, next) => {
  fs.appendFileSync('db.json', `${JSON.stringify(req.body)}\n`)
  res.status(204).end()
})
apiApp.listen(8081, () => console.log('Listening...'))
// set up proxy
const proxyApp = express()
proxyApp.use('/', proxy('https://www.zillow.com/', {
  userResHeaderDecorator: (headers) => {
    headers['x-frame-options'] = ''
    headers['content-security-policy'] = ''
    return headers
  }
}))
proxyApp.listen(8080, () => console.log('Listening...'))