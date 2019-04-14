export default function(res) {
	return function({message}) {
		if (message) {
			res.status(208).send({error: message});
		} else {
			res.sendStatus(500)
		}
		
	}
}