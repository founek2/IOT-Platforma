import React from 'react';
import clsx from 'clsx';

if (process.env.BABEL_ENV !== 'node') {
	require('./Loader/index.css');
}

function Loader({ open, className, center }) {
	return open ? (
		<div className={clsx('relative', className, center && 'loader--center')}>
			<div className="loader-5">
				<span />
			</div>
		</div>
	) : null;
}
export default Loader;
