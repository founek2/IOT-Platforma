import { IThingProperty, PropertyDataType, IThingPropertyEnum } from "../models/interface/thing";

export function validateValue(
	property: IThingProperty,
	value: string
): { valid: true; value: string | number } | { valid: false } {
	if (property.dataType === PropertyDataType.float) {
		const val = parseFloat(value);
		return Number.isNaN(val) ? { valid: false } : { valid: true, value: val };
	}

	if (property.dataType === PropertyDataType.integer) {
		const val = parseInt(value);
		return Number.isNaN(val) ? { valid: false } : { valid: true, value: val };
	}

	if (property.dataType === PropertyDataType.enum) {
		return (property as IThingPropertyEnum).format.includes(value)
			? { valid: true, value: value }
			: { valid: false };
	}

	return { valid: false };
}
