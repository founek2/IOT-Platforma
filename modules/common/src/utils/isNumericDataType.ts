import { PropertyDataType } from "../models/interface/thing";

export function isNumericDataType(dataType: PropertyDataType) {
	return dataType === PropertyDataType.integer || dataType === PropertyDataType.float;
}
