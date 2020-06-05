import React, { useState } from 'react'
import Slider from '@material-ui/core/Slider';
import FormHelperText from '@material-ui/core/FormHelperText';
import Typography from '@material-ui/core/Typography';

function MySlider({ onChange, label, value, min = 0, max = 100, error, FormHelperTextProps, helperText, ...other }) {
    const [val, setVal] = useState(value);
    return <div>
        <Typography id="continuous-slider" gutterBottom>
            {label}
        </Typography>
        <Slider
            value={Number(val)}
            onChange={(e, val) => setVal(val)}
            onChangeCommitted={(e, newValue) => onChange({ target: { value: newValue } })}
            aria-labelledby="continuous-slider"
            valueLabelDisplay="auto"
            min={min}
            max={max}
            {...other}
        />
        {error && <FormHelperText {...FormHelperTextProps}>{helperText}</FormHelperText>}
    </div>
}

export default MySlider