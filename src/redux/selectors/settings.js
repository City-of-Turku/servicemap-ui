export const useAccessibleMap = state => state.settings.mapType === 'accessible_map';
export const selectCities = state => state.settings.cities;

export default { useAccessibleMap, selectCities };
