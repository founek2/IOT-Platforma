export default function blobToBase64(blob) {
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