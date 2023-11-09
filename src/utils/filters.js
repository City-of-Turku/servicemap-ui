import config from '../../config';
import { getUnitCount } from './units';

const PRIVATE_ORGANIZATION_TYPES = [10, 'PRIVATE_ENTERPRISE'];

export const filterEmptyServices = (cities, organizationIds) => (obj) => {
  if (!obj || obj.object_type !== 'service' || !obj.unit_count) {
    return true;
  }
  if (obj.unit_count.total === 0) {
    return false;
  }
  if (cities.length && cities.every(city => getUnitCount(obj, city) === 0)) {
    return false;
  }
  return !organizationIds.length || !organizationIds.every(org => getUnitCount(obj, org) === 0);
};

const filterByOrganizationIds = organizationIds => {
  if (organizationIds.length === 0) {
    return () => true;
  }
  const organizationSettings = {};
  organizationIds.forEach(orgId => {
    organizationSettings[orgId] = true;
  });
  return result => {
    // There are organizations so we filter by organization
    const contractTypeId = result.contract_type?.id;
    // we do not want NOT_DISPLAYED services
    if (contractTypeId === 'NOT_DISPLAYED') {
      return false;
    }
    // we do not want private services
    if (contractTypeId === 'PRIVATE_SERVICE' || PRIVATE_ORGANIZATION_TYPES.includes(result.organizer_type)) {
      return false;
    }
    const resultDepartment = result.department?.id || result.department;
    const resultRootDepartment = result.root_department?.id || result.root_department;

    return organizationSettings[resultDepartment] || organizationSettings[resultRootDepartment];
  };
};

/**
 * Creates a filter that filters by municipality against citySettings
 * @param citySettings given by state with selectCities
 * @param getter access to municipality data, defaults to y => y.municipality
 * @returns filter that checks for municipality
 */
export const filterByCitySettings = (citySettings, getter = y => y.municipality) => {
  // This is a bit defensive to go with config.cities
  const selectedCities = config.cities.filter(city => citySettings[city]);
  if (!selectedCities.length) {
    return () => true;
  }
  const allowedCitySettings = {};
  selectedCities.forEach(city => {
    allowedCitySettings[city] = true;
  });
  return x => allowedCitySettings[getter(x)];
};

export const filterByCities = (cities, getter = y => y.municipality) => {
  const citySettings = {};
  cities.forEach(city => {
    citySettings[city] = true;
  });
  return filterByCitySettings(citySettings, getter);
};

export const filterCitiesAndOrganizations = (
  cities = [], organizationIds = [], onlyUnits = false,
) => {
  const getter = result => result.municipality?.id || result.municipality;
  const cityFilter = filterByCities(cities, getter);
  const organizationFilter = filterByOrganizationIds(organizationIds);
  return result => {
    if (onlyUnits && result.object_type !== 'unit') return false;
    // Services are not filtered by cities or organizations
    if (['service', 'servicenode'].includes(result.object_type)) return true;

    // Addresses are not filtered by organizations
    if (result.object_type === 'address') return cityFilter(result);

    return cityFilter(result) && organizationFilter(result);
  };
};

export const filterResultTypes = () => (obj) => {
  const allowedTypes = ['unit', 'service', 'address', 'event'];
  return (allowedTypes.includes(obj.object_type));
};
