import { clone } from 'ramda'

var blobToBase64 = function(blob) {
     return new Promise((resolve, reject) => {
          var reader = new FileReader()
          reader.onload = function() {
               var dataUrl = reader.result
               //var base64 = dataUrl.split(',')[1]
               resolve(dataUrl)
          }
          reader.readAsDataURL(blob)

          reader.onerror = reject
     })
}

export default async function loadFilesInFormData(formData, deepPaths) {
     const data = clone(formData)
     return new Promise((resolve, reject) => {
          const promises = []
          deepPaths.forEach(deepPath => {
               const field = data[deepPath]
               if (typeof field === 'object' && field.url) {
                    promises.push(
                         fetch(field.url)
                              .then(res => res.blob())
                              .then(async blob => {
							field.data = await blobToBase64(blob)
							delete field.url;
                              })
                    )
               }
          })
          Promise.all(promises)
               .then(() => resolve(data))
               .catch(reject)
     })
}
