import path from "path"
import express from 'express'
import dotenv from 'dotenv'
import schedule from 'node-schedule'
import { connectdb } from './db/connection.js'
import { bootstrap } from './src/modules/bootstrap.js'
import { User } from "./db/models/user.model.js"
import { status } from "./src/utilis/enums.js"
const app =express()
const port=3000
schedule.scheduleJob('1 1 1 * * *',async function(){
    const users =await User.find({status:status.PENDING,createdAt:{$lte:Date.now()-30*24*60*60*1000}})
    const userIds=users.map((user)=>{return user._id})
    await User.deleteMany({_id:{$in:userIds}})
})
schedule.scheduleJob('1 1 1 * * *',async ()=>{
    const users=await User.find({status:status.DELETED,updatedAt:Date.now()-3*30*24*60*60*1000})
})
dotenv.config({path:path.resolve("./config/.env")})
connectdb()
bootstrap(app)
app.listen(port,()=>{
    console.log('server is running on port',port);
})