export default function (roleName: string, user: { Roles: Array<{ name: string }> | undefined } | null): boolean {
    const res = user?.Roles?.some(role => role.name === roleName)

    return Boolean(res)
}