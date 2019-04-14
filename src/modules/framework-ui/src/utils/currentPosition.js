import checkPermission from './requestPermission';

let geo = null;

function setGeo() {
     geo = navigator.geolocation;
}

function nullGeo() {
     geo = null;
}
export const init = (success, error, onPromt) => {
     if ('geolocation' in navigator) {
          checkPermission(
               'geolocation',
               () => {
				setGeo();
                    success();
                    
               },
               () => {
                    nullGeo();
                    error();
			},
			() => navigator.geolocation.getCurrentPosition(() => {})
          );
     } else {
          console.log('unsuported browser');
     }
};

export const get = (success, error) => {
     if (geo) {
		var location_timeout = setTimeout(() => error("cannotFindPosition"), 10000);
          geo.getCurrentPosition(
               pos => {
				clearTimeout(location_timeout);
                    console.log('getPosition', pos);
                    success(pos);
               },
               err => {
				clearTimeout(location_timeout);
                    console.log(err);
                    error(err);
               }
          );
     } else {
          console.log('geolocation not inicialized');
          error && error();
     }
};

/**
 * return watchID
 * @param {Function} Fn
 */
export const watching = Fn => {
     if (geo) {
          return geo.watchPosition(Fn);
     } else {
     }
};

export const clearWatch = id => {
     if (geo) {
          geo.clearWatch(id);
     } else {
     }
};
