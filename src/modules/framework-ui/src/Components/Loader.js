import React from 'react';

if (process.env.BABEL_ENV !== "node") {
	require('./Loader/index.css');
}

function Loader(props) {
     return props.open ? (
          <div className="relative">
               <div className="loader-5">
                    <span />
               </div>
          </div>
     ) : null;
}
export default Loader;
