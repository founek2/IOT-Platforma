import React from 'react';

if (process.env.BABEL_ENV !== "node") {
	require('./Loader/index.css');
}

function Loader({open, className}) {
     return open ? (
          <div className={`relative ${className ? className : "" }`}>
               <div className="loader-5">
                    <span />
               </div>
          </div>
     ) : null;
}
export default Loader;
