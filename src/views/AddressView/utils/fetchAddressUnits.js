import { unitsFetch } from '../../../utils/fetch';

const fetchAddressUnits = async (lnglat) => {
  const options = {
    lat: `${lnglat[1]}`,
    lon: `${lnglat[0]}`,
    distance: 500,
    only: 'name,location,accessibility_shortcoming_count,',
    geometry: false,
    page: 1,
    page_size: 500,
  };

  // Pass a no-op onNext to force following all result pages ("next" links),
  // otherwise only the first page (page_size) of units would be returned.
  const units = await unitsFetch(options, null, null, null, () => {});
  return units;
};

export default fetchAddressUnits;
