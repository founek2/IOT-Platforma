import { IDiscoveryProperty, IDiscoveryThing } from "common/lib/models/interface/discovery";
import { IThingProperty, PropertyDataType, IThingPropertyNumeric, IThingPropertyEnum, IThing } from "common/lib/models/interface/thing";
import { assoc, assocPath, map, o } from "ramda";

export function convertProperty(property: IDiscoveryProperty): IThingProperty {
    if (!property.format) return property as IThingProperty;

    if (
        property.dataType === PropertyDataType.float ||
        property.dataType === PropertyDataType.integer
    ) {
        const range = property.format.split(":").map(Number);
        return assoc("format", { min: range[0], max: range[1] }, property) as IThingPropertyNumeric;
    } else if (property.dataType === PropertyDataType.enum)
        return assoc("format", property.format.split(","), property) as unknown as IThingPropertyEnum;

    return property as IThingProperty;
}

export function convertDiscoveryThing(thing: IDiscoveryThing): IThing {
    return assocPath(["config", "properties"],
        map(o(
            convertProperty,
            propertyId => assocPath(["propertyId"], propertyId, thing.config.properties[propertyId])
        ),
            thing.config.propertyIds!),
        thing) as unknown as IThing
}