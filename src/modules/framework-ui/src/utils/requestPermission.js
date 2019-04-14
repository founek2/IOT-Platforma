function handlePermission(name, resolve, reject, onPromt) {
     navigator.permissions.query({ name }).then(function(result) {
          if (result.state === 'granted') {
               resolve()
               report(result.state)
          } else if (result.state === 'prompt') {
               // resolve();
               onPromt()
               report(result.state)
          } else if (result.state === 'denied') {
               report(result.state)
               reject()
          }
          result.onchange = function() {
               if (result.state === 'granted') {
                    resolve()
                    report(result.state)
               } else if (result.state === 'prompt') {
                    // resolve();
                    onPromt()
                    report(result.state)
               } else if (result.state === 'denied') {
                    report(result.state)
                    reject()
               }
          }
     })
}

function report(state) {
     console.log('Permission ' + state)
}

export default handlePermission
