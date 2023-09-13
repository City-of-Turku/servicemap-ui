export const useAccessibleMap = state => state.settings.mapType === 'accessible_map';
export const getCitySettings = state => state.settings.cities;

export default { useAccessibleMap, getCitySettings };
