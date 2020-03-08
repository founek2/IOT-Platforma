import fs from 'fs'
import path from 'path'
import { IMAGES_DEVICES_FOLDER } from '../constants'
import {devLog, infoLog} from 'framework/src/Logger'

const imgExtensions = ['png', 'jpg', 'jpeg']
let imagesPath;

export function init(config) {
     imagesPath = config.imagesPath;
     infoLog("Init img path> ", imagesPath)
}

export function saveImageBase64(base64Data, fileName, ext) {
     return new Promise((resolve, reject) => {
          console.log("Saving", fileName, imagesPath, IMAGES_DEVICES_FOLDER)
          if (!imgExtensions.some(ex => ex === ext)) reject('notAllowedExtension')
          else {
               const data = base64Data.replace(/^data:image\/\w+;base64,/, '')
               devLog("saving file to", path.join(imagesPath, fileName + "." + ext))
               fs.writeFile(path.join(imagesPath, IMAGES_DEVICES_FOLDER, fileName + "." + ext), data, 'base64', function (err) {
                    console.log(err)
                    if (err) reject(err)
                    resolve()
               })
          }
     })
}

export function deleteImage(fileName) {
     return new Promise((resolve, reject) => {
          console.log("Remov", fileName, imagesPath, IMAGES_DEVICES_FOLDER)
          devLog("removing file from", path.join(imagesPath, IMAGES_DEVICES_FOLDER, fileName))
          fs.unlink(path.join(imagesPath, fileName), err => {
               if (err) reject(err)
               resolve()
          })
     })
}

export function validateFileExtension(ext) {
     return imgExtensions.some(ex => ex === ext)
}
