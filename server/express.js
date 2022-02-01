import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import userRoutes from './routes/user.routes.js'
import authRoutes from './routes/auth.routes.js'
import courseRoutes from './routes/course.routes.js'
import enrollmentRoutes from './routes/enrollment.routes.js'



//configure express.js so that it serves static files from the dist folder
const CURRENT_WORKING_DIR = process.cwd()
const app = express()


// parse body params and attache them to req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser()) //Cookie parsing middleware to parse and set cookies in request objects.
app.use(compress()) //Compression middleware that will attempt to compress response bodies for all requests that traverse through the middleware.
// secure apps by setting various HTTP headers
app.use(helmet()) //Collection of middleware functions to help secure Express apps by setting various HTTP headers
// enable CORS - Cross Origin Resource Sharing
app.use(cors()) //Middleware to enable cross-origin resource sharing (CORS)

app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))

// mount routes 
app.use('/', userRoutes)
app.use('/', authRoutes) //This will make the routes we define in auth.routes.js accessible from the clientside.
app.use('/', courseRoutes)
app.use('/', enrollmentRoutes)

// Catch unauthorised errors
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({"error" : err.name + ": " + err.message})
  }else if (err) {
    res.status(400).json({"error" : err.name + ": " + err.message})
    console.log(err)
  }
})

export default app
