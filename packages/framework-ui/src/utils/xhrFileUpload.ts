type xhrUploadArgs = {
    url: string,
    onCompleted?: (e: ProgressEvent<EventTarget>) => void,
    onProgress?: (e: ProgressEvent<EventTarget>) => void
    file: string | ArrayBufferView | ArrayBuffer | Blob
}

export default function xhrFileUpload({ url, onCompleted, onProgress, file }: xhrUploadArgs) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest()
        xhr.open("PUT", url, true)
        xhr.onload = (e) => {
            if (onCompleted) onCompleted(e)
            resolve(e)
        }
        if (onProgress) xhr.upload.onprogress = onProgress
        xhr.send(file)
        xhr.onerror = reject
    })
}