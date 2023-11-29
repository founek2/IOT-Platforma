export default function (value: any) {
    return value && Object.prototype.toString.call(value) === "[object Object]"
}