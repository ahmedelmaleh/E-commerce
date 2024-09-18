import pkg from 'bcrypt'
export const hashPassword=({password='',saltRound=8})=>{
    return pkg.hashSync(password,saltRound)
}
export const comparePassword=({password='',hashPassword=8})=>{
    return pkg.compareSync(password,hashPassword)
}
