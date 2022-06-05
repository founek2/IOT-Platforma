import { IDiscoveryThing } from '@common/models/interface/discovery';
import {
    IThingProperty,
    PropertyDataType,
    IThingPropertyNumeric,
    IThingPropertyEnum,
    IThing,
} from '@common/models/interface/thing';
import { assoc, assocPath, map, o } from 'ramda';

export function convertProperty(property: IThingProperty): IThingProperty {
    if (!('format' in property)) return property;

    if (
        property.format &&
        (property.dataType === PropertyDataType.float || property.dataType === PropertyDataType.integer)
    ) {
        const range = (property.format as unknown as string).split(':').map(Number);
        return assoc('format', { min: range[0], max: range[1] }, property) as IThingPropertyNumeric;
    } else if (property.dataType === PropertyDataType.enum)
        return assoc(
            'format',
            (property.format! as unknown as string).split(','),
            property
        ) as unknown as IThingPropertyEnum;

    return property as IThingProperty;
}

export function convertDiscoveryThing(thing: IDiscoveryThing): IThing {
    return assocPath(
        ['config', 'properties'],
        map(
            o(convertProperty, (propertyId) =>
                assocPath(['propertyId'], propertyId, thing.config.properties[propertyId])
            ),
            thing.config.propertyIds!
        ),
        thing
    ) as unknown as IThing;
}
