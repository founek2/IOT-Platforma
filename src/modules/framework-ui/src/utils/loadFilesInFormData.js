import { clone, forEachObjIndexed } from 'ramda'
import blobToBase64 from './blobToBase64'
import setInPath from './setInPath'
import MyFile from '../dto/MyFile'

const isObject = (val) => Object.prototype.toString.call(val) === "[object Object]"

export default async function loadFilesInFormData(formData) {
     let newData = formData
     // return new Promise((resolve, reject) => {
     //      const promises = []
     //      deepPaths.forEach(deepPath => {
     //           const field = data[deepPath]
     //           if (typeof field === 'object' && field.url) {
     //                promises.push(
     //                     fetch(field.url)
     //                          .then(res => res.blob())
     //                          .then(async blob => {
	// 						field.data = await blobToBase64(blob)
	// 						delete field.url;
     //                          })
     //                )
     //           }
     //      })
     //      Promise.all(promises)
     //           .then(() => resolve(data))
     //           .catch(reject)
     // })
     const arr = []
    
     recursive((val, deepPath) => {
          arr.push(val.getDataFile().then((obj) => {
               newData = setInPath(deepPath, obj, newData)
          }))
     }, isObject, (val) => isObject(val) && val.url && val.getDataFile, formData) // value instanceof MyFIle did not work
     await Promise.all(arr)

     return newData
}

function recursive(transform, predicate,predicateProcess, object) {
     const func = (accum = '') => (value, key) => {
          if (predicateProcess(value)) transform(value, accum + key)
          if (predicate(value)) return recObj(value, accum + key + ".")
     }

     function recObj(obj, accum) {
          forEachObjIndexed(func(accum), obj)
     }

     recObj(object)
}