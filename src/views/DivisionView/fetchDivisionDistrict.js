import { districtFetch } from '../../utils/fetch';

// Fetch district data for specific devision using ocdID
const fetchDivisionDistrict = async (ocdID) => {
  const options = {
    ocd_id: ocdID,
    page: 1,
    geometry: true,
  };
  // Pass a no-op onNext to force following all result pages ("next" links),
  // otherwise only the first page of districts would be returned.
  const districts = await districtFetch(options, null, null, null, () => {});

  const data = (districts || []).reduce((result, item) => {
    result.push(item);
    return result;
  }, []);

  return data;
};

export default fetchDivisionDistrict;
