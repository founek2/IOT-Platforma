import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

function MyCheckbox({ label, onChange, value }) {
    return (
        <FormControlLabel
            control={
                <Checkbox checked={value === 'true' || value === true} onChange={(e) => {
                    e.target.value = e.target.checked
                    onChange(e);
                }} value={String(value)} />
            }
            label={label}
        />
    )
}
MyCheckbox.defaultProps = {
    value: false
}

export default MyCheckbox