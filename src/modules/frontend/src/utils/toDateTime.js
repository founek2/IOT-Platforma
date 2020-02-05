export default function (dateArg){
    if (!dateArg) return "";
    const date = new Date(dateArg)
    return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
     + " " + date.getDate() + ". " + (date.getMonth() + 1) + " " + date.getFullYear()
}