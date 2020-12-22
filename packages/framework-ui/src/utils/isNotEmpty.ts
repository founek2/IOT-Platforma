import { isEmpty, not } from 'ramda'

export default function isNotEmpty(value: any) {
    return not(isEmpty(value))
}