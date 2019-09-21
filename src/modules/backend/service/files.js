import fs from 'fs'
import path from 'path'
import { IMAGES_DEVICES_FOLDER } from '../constants'
import {devLog} from 'framework/src/Logger'

const imgExtensions = ['png', 'jpg', 'jpeg']

export function saveImageBase64(base64Data, fileName, ext) {
     return new Promise((resolve, reject) => {
          if (!imgExtensions.some(ex => ex === ext)) reject('notAllowedExtension')
          else {
               const data = base64Data.replace(/^data:image\/\w+;base64,/, '')
               devLog("saving file to", path.join(process.env.ROOT_PATH, fileName + "." + ext))
               fs.writeFile(path.join(process.env.ROOT_PATH, IMAGES_DEVICES_FOLDER, fileName + "." + ext), data, 'base64', function (err) {
                    console.log(err)
                    if (err) reject(err)
                    resolve()
               })
          }
     })
}

export function deleteImage(filePathFromDB) {
     console.log("rootPath", process.env.ROOT_PATH)
     return new Promise((resolve, reject) => {
          devLog("removing file from", path.join(process.env.ROOT_PATH, filePathFromDB))
          fs.unlink(path.join(process.env.ROOT_PATH, filePathFromDB), err => {
               if (err) reject(err)
               resolve()
          })
     })
}

export function validateFileExtension(ext) {
     return imgExtensions.some(ex => ex === ext)
}
