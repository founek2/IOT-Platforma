import f from 'date-fns/format'
import fd from 'date-fns/formatDistance'
import fr from 'date-fns/formatRelative'
import cs from 'date-fns/locale/cs'
import fdtn from 'date-fns/formatDistanceToNow'

export { default as subDays } from 'date-fns/subDays'

export function format(date: number | Date, format: string) {
    return f(date, format, {
        locale: cs
    })
}

export function formatDistance(date: number | Date, baseDate: number | Date) {
    return fd(date, baseDate, {
        locale: cs
    })
}

export function formatRelative(date: number | Date, baseDate: number | Date) {
    return fr(date, baseDate, {
        locale: cs
    })
}

export function formatDistanceToNow(date: number | Date) {
    return fdtn(date, {
        locale: cs
    })
}