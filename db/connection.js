import mongoose from "mongoose";
export const connectdb=()=>{mongoose.connect(process.env.DB_URL).then(()=>{
    console.log("db is connected sucssefully");
    
}).catch((err)=>{
    console.log("failed to connect to db"); 
    
    
})}
