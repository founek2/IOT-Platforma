import type { IThing, IThingProperty } from "../models/interface/thing";

export function getProperty(thing: IThing, propertyId: IThingProperty["propertyId"]) {
	return thing.config.properties.find((property) => property.propertyId === propertyId)!;
}
