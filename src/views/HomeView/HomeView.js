import { Map, DirectionsBike } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';
import config from '../../../config';
import { SearchBar } from '../../components';
import MobileComponent from '../../components/MobileComponent';
import NewsInfo from '../../components/NewsInfo';
import PaperButton from '../../components/PaperButton';
import { getIcon } from '../../components/SMIcon';
import { useNavigationParams } from '../../utils/address';

const HomeView = (props) => {
  const {
    classes, toggleSettings, navigator, userLocation,
  } = props;

  const { formatMessage } = useIntl();
  const getAddressNavigatorParams = useNavigationParams();

  const renderNavigationOptions = () => {
    const noUserLocation = !userLocation || !userLocation.coordinates || !userLocation.addressData;

    const notFoundText = noUserLocation ? 'location.notFound' : null;
    const subtitleID = userLocation && userLocation.allowed ? notFoundText : 'location.notAllowed';

    let areaSelection = null;

    if (config.showAreaSelection) {
      areaSelection = (
        <PaperButton messageID="home.buttons.area.tku" icon={<Map />} link onClick={() => navigator.push('area')} />
      );
    }

    return (
      <div className={classes.background}>
        <div className={classes.buttonContainer}>
          <nav aria-label={formatMessage({ id: 'app.navigation.home' })}>
            {areaSelection}
            <PaperButton
              messageID="home.buttons.closeByServices"
              icon={getIcon('location')}
              link
              disabled={noUserLocation}
              onClick={() => {
                navigator.push('address', getAddressNavigatorParams(userLocation.addressData));
              }}
              subtitleID={subtitleID && subtitleID}
            />
            {/* Turku mobility platform settings */}
            <PaperButton
              messageID="home.buttons.mobilityPlatformSettings"
              icon={<DirectionsBike />}
              link
              onClick={() => navigator.push('mobilityPlatform')}
            />
            <PaperButton
              messageID="home.buttons.services"
              icon={getIcon('serviceList')}
              link
              onClick={() => navigator.push('serviceTree')}
            />
            <MobileComponent>
              <PaperButton
                messageID="home.buttons.settings"
                icon={getIcon('accessibility')}
                link
                onClick={() => toggleSettings('mobile')}
              />
            </MobileComponent>
            <PaperButton
              messageID="home.send.feedback"
              icon={getIcon('feedback')}
              link
              onClick={() => navigator.push('feedback')}
            />
            <PaperButton
              id="home-paper-info-button"
              messageID="info.title"
              icon={getIcon('help')}
              link
              onClick={() => {
                navigator.push('info', null, 'home-paper-info-button');
              }}
            />
          </nav>
          <NewsInfo showCount={2} />
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <SearchBar hideBackButton header />
      {renderNavigationOptions()}
    </div>
  );
};

export default HomeView;

// Typechecking
HomeView.propTypes = {
  navigator: PropTypes.objectOf(PropTypes.any),
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  toggleSettings: PropTypes.func.isRequired,
  userLocation: PropTypes.objectOf(PropTypes.any),
};

HomeView.defaultProps = {
  navigator: null,
  userLocation: null,
};
