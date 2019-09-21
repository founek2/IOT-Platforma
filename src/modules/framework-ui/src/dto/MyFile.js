import MyFileData from './MyFileData'
import blobToBase64 from '../utils/blobToBase64'

export default class MyFile {
    constructor(name, url) {
         this.name = name
         this.url = url
    }

    getDataFile = async () => {
         const res = await fetch(this.url)
         const blob = await res.blob()

         return new MyFileData(this.name, await blobToBase64(blob))
    }
}