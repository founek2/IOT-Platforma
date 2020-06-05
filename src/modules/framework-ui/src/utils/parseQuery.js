export default function parseQuery(queryString) {
     var query = {}
     if (/^[?]{1}/.test(queryString)) {
          var pairs = queryString.substr(1).split('&')
          for (var i = 0; i < pairs.length; i++) {
               var pair = pairs[i].split('=')
               query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '')
          }
     }
     return query
}
