import {
  useEffect, useMemo, useRef, useState,
} from 'react';
import {
  fetchMobilityDataWithoutGeometry,
} from '../../../components/MobilityPlatform/mobilityPlatformRequests/mobilityPlatformRequests';
import {
  accessibilityZoneCategories,
  groupAccessibilityZones,
} from '../../../components/MobilityPlatform/AccessibilityZones/utils/utils';

// Only the names and extra fields are needed for the lists, the geometries of the selected sites
// are fetched by the map layer.
const listFields = 'name_fi,extra';
const listPageSize = 1000;

const typeNames = [...new Set(accessibilityZoneCategories.map(category => category.typeName))];

/**
 * Fetch the accessibility zones of the open lists without geometry and group them by site for each category.
 * Each content type is fetched once, when the first list using it is opened.
 * @param {Object} openLists keys are category keys and values tell if the list of the category is open
 * @returns {Object} accessibilityZoneGroups, keys are category keys and values are arrays of groups
 */
const useAccessibilityZoneFetch = openLists => {
  const [dataByTypeName, setDataByTypeName] = useState({});
  const requestedTypeNamesRef = useRef(new Set());
  const controllerRef = useRef(new AbortController());

  useEffect(() => () => controllerRef.current.abort(), []);

  const openTypeNames = typeNames.filter(typeName => accessibilityZoneCategories.some(
    category => category.typeName === typeName && openLists[category.key],
  ));

  useEffect(() => {
    openTypeNames
      .filter(typeName => !requestedTypeNamesRef.current.has(typeName))
      .forEach(async typeName => {
        requestedTypeNamesRef.current.add(typeName);
        try {
          const data = await fetchMobilityDataWithoutGeometry(
            { type_name: typeName, only: listFields, page_size: listPageSize },
            controllerRef.current.signal,
          );
          setDataByTypeName(prevState => ({ ...prevState, [typeName]: data }));
        } catch (err) {
          // Fetched again when the list is opened the next time.
          requestedTypeNamesRef.current.delete(typeName);
          console.warn(err.message);
        }
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openTypeNames.join(',')]);

  const accessibilityZoneGroups = useMemo(() => accessibilityZoneCategories.reduce((acc, category) => {
    acc[category.key] = groupAccessibilityZones(dataByTypeName[category.typeName], category);
    return acc;
  }, {}), [dataByTypeName]);

  return { accessibilityZoneGroups };
};

export default useAccessibilityZoneFetch;
