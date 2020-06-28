import { forEachObjIndexed } from 'ramda'
import setInPath from './setInPath'

const isObject = (val) => Object.prototype.toString.call(val) === "[object Object]"

export default async function loadFilesInFormData(formData) {
     let newData = formData
     const arr = []

     recursive((val, deepPath) => {
          arr.push(val.getDataFile().then((obj) => {
               newData = setInPath(deepPath, obj, newData)
          }))
     }, isObject, (val) => isObject(val) && val.url && val.getDataFile, formData) // value instanceof MyFIle did not work
     await Promise.all(arr)

     return newData
}

function recursive(transform, predicate, predicateProcess, object) {
     const func = (accum = '') => (value, key) => {
          if (predicateProcess(value)) transform(value, accum + key)
          if (predicate(value)) return recObj(value, accum + key + ".")
     }

     function recObj(obj, accum) {
          forEachObjIndexed(func(accum), obj)
     }

     recObj(object)
}