/**
 * Calculate diff between now and provided time -> translate to human readable form
 * In form: "Last update before 10 hours"
 * @param {Date} time 
 * @returns {Array} [text "updated before:", timeout to next change]
 */
export default function getLastUpdateText(time, prefix = "Poslední aktualizace před", nowText = "Aktuální") {
     if (time == "Invalid Date") return []

     const now = new Date();
     const diff = new Date(now - time);
     const diffSec = Math.round(diff / 1000)
     const min = Math.floor(diffSec / 60)
     const hours = Math.floor(min / 60)
     const days = Math.floor(hours / 24)

     if (diff <= 0 || diffSec < 60)
          return [nowText, 60 - diffSec];

     if ((now.getYear() - time.getYear()) > 0) {
          return [prefix + ' ' + Number(now.getYear() - time.getYear()) + ' rok', null];
     } else if (diff.getMonth() > 0) {
          return [prefix + ' ' + diff.getMonth() + ' měsíc', null];
     } else if (days >= 1) {
          return [prefix + ' ' + days + ' dny', (days + 1) * 24 * 60 * 60 - diffSec];
     } else if (hours >= 1) {
          return [prefix + ' ' + hours + ' hod', (hours + 1) * 60 * 60 - diffSec];
     } else {
          return [prefix + ' ' + min + ' min', (min + 1) * 60 - diffSec];
     }
     //  else {
     //      return [prefix + ' ' + diffSec % 60 + ' sec', 1];
     // }
}