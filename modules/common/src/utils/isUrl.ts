export function isUrl(value: any) {
    return typeof value === "string" && value.startsWith("https://")
}