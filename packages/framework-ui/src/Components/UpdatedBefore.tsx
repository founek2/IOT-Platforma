import React from 'react';
import Typography, { TypographyProps } from '@material-ui/core/Typography';
import getLastUpdateText from '../utils/getLastUpdateText';
import ForceUpdate from './forceUpdateHoc';

type UpdatedBeforeProps = {
    time: Date;
    prefix: string;
    forwardRef: React.ForwardedRef<any>;
} & TypographyProps;
function UpdatedBefore({ time, prefix, forwardRef, ...other }: UpdatedBeforeProps) {
    const [text] = getLastUpdateText(time, prefix);
    return (
        <div className="textCenter">
            <Typography
                display="inline"
                {...other}
                ref={forwardRef}
                title={time instanceof Date ? time.toLocaleString() : ''}
            >
                {text}
            </Typography>
        </div>
    );
}

export default React.forwardRef(({ time, ...other }: Omit<UpdatedBeforeProps, 'forwardRef'>, ref) => (
    <ForceUpdate updateTime={time}>
        <UpdatedBefore time={time} {...other} forwardRef={ref} />
    </ForceUpdate>
));
