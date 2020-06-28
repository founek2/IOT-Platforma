export default function (dateArg) {
    if (!dateArg) return "";
    const date = new Date(dateArg)
    return pad(date.getHours()) + ":" + pad(date.getMinutes()) + ":" + pad(date.getSeconds())
        + " " + date.getDate() + ". " + (date.getMonth() + 1) + ". " + date.getFullYear()
}

function pad(val) {
    return val > 9 ? val : "0" + val;
}