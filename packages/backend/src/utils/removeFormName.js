export default function(formsData) {
     let result = {};
     for (const name in formsData) {
          result = { ...result, ...formsData[name] };
     }
     return result;
}
