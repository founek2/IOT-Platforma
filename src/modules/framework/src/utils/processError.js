import {devLog} from '../Logger'

export default function(res) {
	return function({message}) {
		console.log("blalala")
		if (message) {
			devLog("Error", message)
			res.status(208).send({error: message});
		} else {
			res.sendStatus(500)
		}
		
	}
}