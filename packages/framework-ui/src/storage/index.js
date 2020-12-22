import {errorLog} from '../Logger'

let storage = localStorage

export function getItem(key) {
     return storage.getItem(key)
}

export function setItem(key, value) {
     return storage.setItem(key, value)
}

export function removeItem(key){
	storage.removeItem(key)
}

export function removeItems(array) {
     array.forEach(key => {
          storage.removeItem(key)
     })
}

export function setStorage(type) {
     if (type === 'local') storage = localStorage
	else if (type === 'session') storage = sessionStorage
	else errorLog("Unsupported storage")
}
