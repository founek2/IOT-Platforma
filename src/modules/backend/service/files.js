import fs from 'fs'
import path from 'path'
import {IMAGES_DEVICES_FOLDER} from '../constants'

const imgExtensions = ['png', 'jpg', 'jpeg']

export function saveImageBase64(base64Data, fileName, ext) {
     return new Promise((resolve, reject) => {
          if (!imgExtensions.some(ex => ex === ext)) reject('notAllowedExtension')
          else {
               const data = base64Data.replace(/^data:image\/\w+;base64,/, '')

               fs.writeFile(path.join(__dirname, "../../../../", IMAGES_DEVICES_FOLDER, fileName + "." + ext), data, 'base64', function(err) {
				console.log(err)
				if (err) reject(err)
                    resolve()
               })
          }
     })
}

export function validateFileExtension(ext) {
     return imgExtensions.some(ex => ex === ext)
}
