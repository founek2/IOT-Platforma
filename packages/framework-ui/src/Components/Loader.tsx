import React from 'react';
import clsx from 'clsx';

if (process.env.BABEL_ENV !== 'node') {
    require('./Loader/index.css');
}
interface LoaderProps {
    open: boolean;
    className?: string;
    center?: boolean;
}
function Loader({ open, className, center }: LoaderProps) {
    return open ? (
        <div className={clsx('relative', className, center && 'loader--center')}>
            <div className="loader-5">
                <span />
            </div>
        </div>
    ) : null;
}
export default Loader;
