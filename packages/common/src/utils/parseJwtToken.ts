export default function parseJwt(token: string): { iat: number; exp: number } {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const buffer = Buffer.from(base64, "base64")
    return JSON.parse(buffer.toString());
}
