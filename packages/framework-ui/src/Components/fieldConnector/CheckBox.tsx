import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

function MyCheckbox({
    label,
    onChange,
    value,
}: {
    label: React.ReactNode;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    value: any;
}) {
    return (
        <FormControlLabel
            control={
                <Checkbox
                    checked={value === 'true' || value === true}
                    onChange={(e) => {
                        // @ts-ignore
                        e.target.value = e.target.checked;
                        onChange(e);
                    }}
                    value={String(value)}
                />
            }
            label={label}
        />
    );
}
MyCheckbox.defaultProps = {
    value: false,
};

export default MyCheckbox;
