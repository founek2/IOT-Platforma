import React, { FunctionComponent } from "react";
import Box, { GeneralBoxProps } from "./BorderBox";

function MyComponent(WrappedComponent: any) {
	return function (props: GeneralBoxProps) {
		return <Box component={WrappedComponent} {...props} />;
	};
}

export default MyComponent;
