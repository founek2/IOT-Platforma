import { IThingProperty, PropertyDataType, IThingPropertyEnum, IThingPropertyNumeric } from "../models/interface/thing";

export function validateValue(
    property: IThingProperty,
    value: string
): { valid: true; value: string | number } | { valid: false } {
    if (property.dataType === PropertyDataType.float) {
        const val = parseFloat(value);
        return !Number.isNaN(val) && isInRange(val, (property as IThingPropertyNumeric).format)
            ? { valid: true, value: val }
            : { valid: false };
    }

    if (property.dataType === PropertyDataType.integer) {
        const val = parseInt(value);
        return !Number.isNaN(val) && isInRange(val, (property as IThingPropertyNumeric).format)
            ? { valid: true, value: val }
            : { valid: false };
    }

    if (property.dataType === PropertyDataType.enum) {
        return (property as IThingPropertyEnum).format.includes(value)
            ? { valid: true, value: value }
            : { valid: false };
    }
    if (property.dataType === PropertyDataType.boolean) {
        return value === "true" || value === "false" ? { valid: true, value: value } : { valid: false };
    }
    if (property.dataType === PropertyDataType.string) {
        return { valid: true, value: value }
    }

    return { valid: false };
}

function isInRange(value: number, format: IThingPropertyNumeric["format"]): boolean {
    if (!format) return true;

    return value >= format.min && value <= format.max;
}
