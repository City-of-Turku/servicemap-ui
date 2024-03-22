export const selectSettings = state => state.settings;
export const useAccessibleMap = state => state.settings.mapType === 'accessible_map';
export const selectCities = state => state.settings.cities;
