
import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import todoRoutes from './routes/todo.routes.js'

// To configure the ENV variables
dotenv.config()

// To Run the server
const app = express()

//To be able to parse the JSON in and out
app.use(express.json())

// To be able to connect with the Frontend without CORS errors
app.use(cors({
     origin: ["http://localhost:5173", process.env.FRONTEND_URL],
      methods: ["GET", "POST", "PATCH", "DELETE"],
      allowedHeaders: ["Content-Type"],
      credentials: true,
}))

// To be able to parse and work with cookies
app.use(cookieParser())

app.use("/api/auth",authRoutes)
app.use("/api/todos",todoRoutes)

const PORT=process.env.PORT

// To start the server,connect with the DB
const startServer = async()=>{
    try{
        await mongoose.connect(`${process.env.DATABASE_URL}`)
        app.listen(PORT,()=>console.log(`App is Listening to PORT ${PORT}`))
    }catch(err){
        console.log(err)
        process.exit(1)
    }
}
startServer()