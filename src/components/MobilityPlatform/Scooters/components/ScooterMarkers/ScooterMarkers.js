import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useMap, useMapEvents } from 'react-leaflet';
import scooterIcon from 'servicemap-ui-turku/assets/icons/icons-icon_scooter_base.svg';
import scooterIconContrast from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_scooter_base-bw.svg';
import rydeIcon from 'servicemap-ui-turku/assets/icons/icons-icon_ryde.svg';
import rydeIconContrast from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_ryde-bw.svg';
import voiIcon from 'servicemap-ui-turku/assets/icons/icons-icon_voi.svg';
import voiIconContrast from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_voi-bw.svg';
import tierIcon from 'servicemap-ui-turku/assets/icons/icons-icon_tier.svg';
import tierIconcontrast from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_tier-bw.svg';
import { useMobilityPlatformContext } from '../../../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../../../redux/selectors/settings';
import useIotDataFetch from '../../../utils/useIotDataFetch';
import useScootersDataFetch from '../../../utils/useScooterDataFetch';
import ScooterInfo from './components/ScooterInfo';
import { isDataValid, createIcon } from '../../../utils/utils';
import { StyledPopupWrapper, StyledPopupInner } from '../../../styled/styled';

const ScooterMarkers = ({ mapObject }) => {
  const { showScooters } = useMobilityPlatformContext();

  const useContrast = useSelector(useAccessibleMap);

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const map = useMap();
  const [zoomLevel, setZoomLevel] = useState(map.getZoom());

  const mapEvent = useMapEvents({
    zoomend() {
      setZoomLevel(mapEvent.getZoom());
    },
  });

  const scooterIconBase = icon(createIcon(useContrast ? scooterIconContrast : scooterIcon, false));
  const rydeProviderIcon = icon(createIcon(useContrast ? rydeIconContrast : rydeIcon, false));
  const voiProviderIcon = icon(createIcon(useContrast ? voiIconContrast : voiIcon, false));
  const tierProviderIcon = icon(createIcon(useContrast ? tierIconcontrast : tierIcon, false));

  const getCorrectIcon = providerName => {
    const lowerName = providerName.toLowerCase();
    if (lowerName === 'ryde') {
      return rydeProviderIcon;
    }
    if (lowerName === 'voi') {
      return voiProviderIcon;
    }
    if (lowerName === 'tier') {
      return tierProviderIcon;
    }
    return scooterIconBase;
  };

  const isDetailZoom = zoomLevel >= mapObject.options.detailZoom;

  const { iotData: scooterDataRyde } = useIotDataFetch('SDR', showScooters.ryde);
  const { iotData: scooterDataVoi } = useIotDataFetch('SDV', showScooters.voi);
  const { data: scooterDataTier } = useScootersDataFetch(showScooters.tier);

  const filterByBounds = data => {
    if (data?.length) {
      return data?.filter(item => map.getBounds().contains([item.lat, item.lon]));
    }
    return [];
  };

  const filteredScootersRyde = filterByBounds(scooterDataRyde);
  const validDataRyde = isDataValid(showScooters.ryde, filteredScootersRyde) && isDetailZoom;

  const filteredScootersVoi = filterByBounds(scooterDataVoi);
  const validDataVoi = isDataValid(showScooters.voi, filteredScootersVoi) && isDetailZoom;

  const filteredScootersTier = filterByBounds(scooterDataTier);
  const validDataTier = isDataValid(showScooters.tier, filteredScootersTier) && isDetailZoom;

  const renderScooterData = (isValid, data, provider) => (
    isValid ? (
      data.map(item => (
        <Marker
          key={item.bike_id}
          icon={getCorrectIcon(provider)}
          position={[item.lat, item.lon]}
        >
          <StyledPopupWrapper>
            <Popup>
              <StyledPopupInner>
                <ScooterInfo item={item} providerName={provider} />
              </StyledPopupInner>
            </Popup>
          </StyledPopupWrapper>
        </Marker>
      ))
    ) : null
  );

  return (
    <>
      {renderScooterData(validDataRyde, filteredScootersRyde, 'Ryde')}
      {renderScooterData(validDataVoi, filteredScootersVoi, 'Voi')}
      {renderScooterData(validDataTier, filteredScootersTier, 'Tier')}
    </>
  );
};

ScooterMarkers.propTypes = {
  mapObject: PropTypes.shape({
    options: PropTypes.shape({
      detailZoom: PropTypes.number,
    }),
  }).isRequired,
};

export default ScooterMarkers;
