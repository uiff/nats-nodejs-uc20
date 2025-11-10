const VERSION_PREFIX = 'v1';
const LOCATION_PREFIX = 'loc';

export function varsChangedEvent(providerId: string): string {
  return `${VERSION_PREFIX}.${LOCATION_PREFIX}.${providerId}.vars.evt.changed`;
}

export function readVariablesQuery(providerId: string): string {
  return `${VERSION_PREFIX}.${LOCATION_PREFIX}.${providerId}.vars.qry.read`;
}

export function providerDefinitionChanged(providerId: string): string {
  return `${VERSION_PREFIX}.${LOCATION_PREFIX}.${providerId}.def.evt.changed`;
}
