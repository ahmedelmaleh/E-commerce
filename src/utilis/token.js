import jwt from 'jsonwebtoken'
export const generateToken=({payload,seretKey='secretKey'})=>{
    return jwt.sign(payload,seretKey)
}


export const verifyToken=({token,secretKey="secretKey"})=>{
    try {
        return jwt.verify(token,secretKey)
    } catch (error) {
        console.log(error);
        
    }
}