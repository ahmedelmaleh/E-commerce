import path from "path"
import express from 'express'
import dotenv from 'dotenv'
import { connectdb } from './db/connection.js'
import { bootstrap } from './src/modules/bootstrap.js'
const app =express()
const port=3000
dotenv.config({path:path.resolve("./config/.env")})
connectdb()
bootstrap(app)
app.listen(port,()=>{
    console.log('server is running on port',port);
})