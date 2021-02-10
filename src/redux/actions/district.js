import { districtFetch, unitsFetch } from '../../utils/fetch';
import { groupDistrictData, parseDistrictGeometry } from '../../views/AreaView/utils/districtData';

export const setHighlightedDistrict = district => ({
  type: 'SET_DISTRICT_HIGHLIGHT',
  district,
});

export const setSelectedDistrictType = district => ({
  type: 'SET_SELECTED_DISTRICT_TYPE',
  district,
});

const setDistrictData = data => ({
  type: 'SET_DISTRICT_DATA',
  data,
});

const updateDistrictData = (type, data) => ({
  type: 'UPDATE_DISTRICT_DATA',
  districtType: type,
  data,
});

export const setDistrictAddressData = data => ({
  type: 'SET_DISTRICT_ADDRESS_DATA',
  data,
});

export const setSelectedSubdistricts = districts => ({
  type: 'SET_SELECTED_SUBDISTRICTS',
  districts,
});

export const setSelectedDistrictServices = services => ({
  type: 'SET_SELECTED_DISTRICT_SERVICES',
  services,
});

export const setAreaViewState = object => ({
  type: 'SET_AREA_VIEW_STATE',
  object,
});

const startUnitFetch = node => ({
  type: 'START_UNIT_FETCH',
  node,
});

const endUnitFetch = data => ({
  type: 'END_UNIT_FETCH',
  node: data.nodeID,
  units: data.units,
});

const startDistrictFetch = districtType => ({
  type: 'START_DISTRICT_FETCH',
  districtType,
});

const endDistrictFetch = districtType => ({
  type: 'END_DISTRICT_FETCH',
  districtType,
});


export const fetchAllDistricts = () => (
  async (dispatch) => {
    const options = {
      page: 1,
      page_size: 500,
      type: 'health_station_district,maternity_clinic_district,lower_comprehensive_school_district_fi,lower_comprehensive_school_district_sv,upper_comprehensive_school_district_fi,upper_comprehensive_school_district_sv,preschool_education_fi,preschool_education_sv,rescue_area,rescue_district,rescue_sub_district,nature_reserve',
      geometry: false,
    };
    const onNext = () => {};
    const onSuccess = (result) => {
      const groupedData = groupDistrictData(result);
      dispatch(setDistrictData(groupedData));
    };
    districtFetch(options, null, onSuccess, null, onNext);
  }
);

export const fetchDistrictGeometry = type => (
  async (dispatch) => {
    const options = {
      page: 1,
      page_size: 500,
      type,
      geometry: true,
      unit_include: 'name,location,street_address,address_zip,municipality',
    };
    const onStart = () => {
      dispatch(startDistrictFetch(type));
    };
    const onNext = () => {};
    const onSuccess = (results) => {
      dispatch(endDistrictFetch(type));
      const filteredData = parseDistrictGeometry(results);
      dispatch(updateDistrictData(type, filteredData));
    };
    districtFetch(options, onStart, onSuccess, null, onNext);
  }
);

export const fetchDistrictUnitList = nodeID => (
  async (dispatch) => {
    dispatch(startUnitFetch(nodeID));
    const options = {
      page: 1,
      page_size: 1000,
      division: nodeID,
    };
    try {
      const data = await unitsFetch(options);
      const units = data.results;
      units.forEach((unit) => {
        unit.object_type = 'unit';
        unit.division_id = nodeID;
      });
      dispatch(endUnitFetch({ nodeID, units }));
    } catch (e) {
      console.warn(e);
      dispatch(endUnitFetch({ nodeID, units: [] }));
    }
  }
);
