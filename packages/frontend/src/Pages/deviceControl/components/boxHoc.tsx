import React from "react";
import Box from "./BorderBox";

function MyComponent(WrappedComponent: any) {
	return function (props: any) {
		return <Box component={WrappedComponent} {...props} />;
	};
}

export default MyComponent;
