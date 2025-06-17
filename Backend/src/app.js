
import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import cors from 'cors'

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors({
     origin: ["http://localhost:5173", process.env.FRONTEND_URL],
      methods: ["GET", "POST", "PATCH", "DELETE"],
      allowedHeaders: ["Content-Type"],
      credentials: true,
}))
app.use(cookieParser())

const PORT=process.env.PORT

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