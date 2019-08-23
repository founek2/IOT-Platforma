import http from 'http'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import initializeDb from './db'
import middleware from './middleware'
import api from './api'
import { getConfig } from './service/config'
import helmet from 'helmet'
import path from 'path'
import checkAndCreateRoot from 'framework/src/services/checkAndCreateRoot'
import Jwt from 'framework/src/services/jwt'
import auth from './auth'
import mqttService from './service/mqtt';
import socketIo from 'socket.io'
import webSockets from './webSockets'


let config = getConfig()

const app = express()

app.server = http.createServer(app)

app.io = require("socket.io")(app.server)

// serve static files
app.use(express.static('deploy'))

app.use(express.urlencoded({ extended: true }))

// logger
app.use(morgan('dev'))

// 3rd party middleware
app.options('*', cors())

// app.use(helmet())

// const corsOptions = {
//      origin: 'https://tracker.iotplatforma.cloud'
// }
// app.use(cors(corsOptions))

function getMaxSize(req) {
     if (req.url == '/api/device' && (req.method == 'POST' || req.method == 'PATCH')) return '2mb'
     return '100kb'
}
app.use((req, res, next) =>
     bodyParser.json({
          limit: getMaxSize(req)
     })(req, res, next)
)

// connect to db
initializeDb(config, db => {
     Jwt.init(config)

     checkAndCreateRoot() // check for roor existence, if not, then ask for password in terminal

     // internal middleware
     app.use(middleware({ config, db }))

     // api router
     app.use('/api', api({ config }))

     app.use("/auth", auth)


     app.use("/websocket", webSockets(app.io))
     
     // fallback index
     app.use('/*', function(req, res) {
          res.sendFile('index.html', { root: './deploy' })
     })

     app.server.listen(process.env.PORT || config.port, () => {
          console.log(`Started on port ${app.server.address().port}`)
     })

     mqttService(app.io); //init

})

export default app
