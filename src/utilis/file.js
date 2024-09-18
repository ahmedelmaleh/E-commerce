import fs from 'fs'
import path from 'path'
export const deleteImage=(filePath)=>{
    const fullPath=path.resolve(filePath)
    fs.unlinkSync(fullPath)
}