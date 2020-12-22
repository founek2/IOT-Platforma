import React from 'react'
import TextField, { TextFieldProps } from '@material-ui/core/TextField'


function MyTextField({ onChange, numeric, ...props }: TextFieldProps & { numeric: boolean }) {
    return <TextField {...props} onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const num = Number(e.target.value)
        if (!numeric || isNaN(num) || e.target.value.length === 0) return onChange && onChange(e)

        onChange && onChange({
            // @ts-expect-error
            target: { value: num }
        })
    }} />
}

export default MyTextField