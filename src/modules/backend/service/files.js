import fs from 'fs'
import path from 'path'
import { IMAGES_DEVICES_FOLDER, PUBLIC_FOLDER } from '../constants'
import {devLog} from 'framework/src/Logger'

const imgExtensions = ['png', 'jpg', 'jpeg']

export function saveImageBase64(base64Data, fileName, ext) {
     return new Promise((resolve, reject) => {
          if (!imgExtensions.some(ex => ex === ext)) reject('notAllowedExtension')
          else {
               const data = base64Data.replace(/^data:image\/\w+;base64,/, '')
               devLog("saving file to", path.join(__dirname, "../../../../", IMAGES_DEVICES_FOLDER, fileName + "." + ext))
               fs.writeFile(path.join(__dirname, "../../../../", IMAGES_DEVICES_FOLDER, fileName + "." + ext), data, 'base64', function (err) {
                    console.log(err)
                    if (err) reject(err)
                    resolve()
               })
          }
     })
}

export function deleteImage(filePathFromDB) {
     return new Promise((resolve, reject) => {
          devLog("removing file from", path.join(__dirname, "../../../../", PUBLIC_FOLDER, filePathFromDB))
          fs.unlink(path.join(__dirname, "../../../../", PUBLIC_FOLDER, filePathFromDB), err => {
               if (err) reject(err)
               resolve()
          })
     })
}

export function validateFileExtension(ext) {
     return imgExtensions.some(ex => ex === ext)
}
