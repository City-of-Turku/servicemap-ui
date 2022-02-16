import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Typography, FormGroup, FormControl, FormControlLabel, Switch, Button,
} from '@material-ui/core';
import { ReactSVG } from 'react-svg';
import { ArrowDropUp, ArrowDropDown } from '@material-ui/icons';
import MobilityPlatformContext from '../../context/MobilityPlatformContext';
import { fetchCultureRoutesGroup } from '../../components/MobilityPlatform/mobilityPlatformRequests/mobilityPlatformRequests';
import { getCurrentLocale, selectRouteName } from '../../components/MobilityPlatform/utils/utils';
import TitleBar from '../../components/TitleBar';
import InfoTextBox from '../../components/MobilityPlatform/InfoTextBox';
import iconWalk from '../../../node_modules/servicemap-ui-turku/assets/icons/icons-icon_walk.svg';
import iconBicycle from '../../../node_modules/servicemap-ui-turku/assets/icons/icons-icon_bicycle.svg';
import iconCar from '../../../node_modules/servicemap-ui-turku/assets/icons/icons-icon_car.svg';

const MobilitySettingsView = ({ classes, intl }) => {
  const [openWalkSettings, setOpenWalkSettings] = useState(false);
  const [openBicycleSettings, setOpenBicycleSettings] = useState(false);
  const [openCarSettings, setOpenCarSettings] = useState(false);
  const [openCultureRouteList, setOpenCultureRouteList] = useState(false);
  const [cultureRouteList, setCultureRouteList] = useState(null);
  const [filteredCultureRouteList, setFilteredCultureRouteList] = useState(null);
  const [cultureRouteDesc, setCultureRouteDesc] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [currentLocale, setCurrentLocale] = useState('fi');
  const [showDescriptionText, setShowDescriptionText] = useState(false);

  const {
    setOpenMobilityPlatform,
    showChargingStations,
    setShowChargingStations,
    showGasFillingStations,
    setShowGasFillingStations,
    showEcoCounter,
    setShowEcoCounter,
    showBicycleStands,
    setShowBicycleStands,
    showCultureRoutes,
    setShowCultureRoutes,
    setCultureRouteId,
  } = useContext(MobilityPlatformContext);

  const apiUrl = window.nodeEnvSettings.MOBILITY_PLATFORM_API;

  useEffect(() => {
    setOpenMobilityPlatform(true);
  }, [setOpenMobilityPlatform]);

  useEffect(() => {
    fetchCultureRoutesGroup(apiUrl, setCultureRouteList);
  }, [setCultureRouteList]);

  // Set current language based on user selection
  useEffect(() => {
    getCurrentLocale(intl.locale, setCurrentLocale);
  }, [intl.locale]);

  useEffect(() => {
    if (cultureRouteList && currentLocale === 'fi') {
      cultureRouteList.sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [cultureRouteList, currentLocale]);

  useEffect(() => {
    if (filteredCultureRouteList && currentLocale === 'en') {
      filteredCultureRouteList.sort((a, b) => a.name_en.localeCompare(b.name_en));
    } else if (filteredCultureRouteList && currentLocale === 'sv') {
      filteredCultureRouteList.sort((a, b) => a.name_sv.localeCompare(b.name_sv));
    }
  }, [filteredCultureRouteList, currentLocale]);

  useEffect(() => {
    if (cultureRouteList && currentLocale === 'en') {
      const filtered = cultureRouteList.filter(item => item.name_en !== null);
      setFilteredCultureRouteList(filtered);
    } else if (cultureRouteList && currentLocale === 'sv') {
      const filtered = cultureRouteList.filter(item => item.name_sv !== null);
      setFilteredCultureRouteList(filtered);
    }
  }, [cultureRouteList, currentLocale]);

  // Toggle functions for main user types
  const walkSettingsToggle = () => {
    if (!openWalkSettings) {
      setOpenWalkSettings(true);
    } else {
      setOpenWalkSettings(false);
    }
  };

  const bicycleSettingsToggle = () => {
    if (!openBicycleSettings) {
      setOpenBicycleSettings(true);
    } else {
      setOpenBicycleSettings(false);
    }
  };

  const carSettingsToggle = () => {
    if (!openCarSettings) {
      setOpenCarSettings(true);
    } else {
      setOpenCarSettings(false);
    }
  };

  // Toggle functions for content types
  const chargingStationsToggle = () => {
    if (!showChargingStations) {
      setShowChargingStations(true);
    } else {
      setShowChargingStations(false);
    }
  };

  const gasFillingStationsToggle = () => {
    if (!showGasFillingStations) {
      setShowGasFillingStations(true);
    } else {
      setShowGasFillingStations(false);
    }
  };

  const ecoCounterStationsToggle = () => {
    if (!showEcoCounter) {
      setShowEcoCounter(true);
    } else {
      setShowEcoCounter(false);
    }
  };

  const bicycleStandsToggle = () => {
    if (!showBicycleStands) {
      setShowBicycleStands(true);
    } else {
      setShowBicycleStands(false);
    }
  };

  const cultureRouteListToggle = () => {
    if (!openCultureRouteList) {
      setOpenCultureRouteList(true);
    } else {
      setOpenCultureRouteList(false);
    }
    if (cultureRouteDesc) {
      setCultureRouteDesc(null);
    }
    if (activeIndex) {
      setActiveIndex(null);
    }
    if (showCultureRoutes) {
      setShowCultureRoutes(false);
    }
  };

  const selectRouteDescription = (descriptionSv, descriptionEn, descriptionFi) => {
    if (currentLocale === 'sv' && descriptionSv !== null) {
      setCultureRouteDesc(descriptionSv);
    } else if (currentLocale === 'en' && descriptionEn !== null) {
      setCultureRouteDesc(descriptionEn);
    } else {
      setCultureRouteDesc(descriptionFi);
    }
  };

  const setCultureRouteState = (descriptionSv, descriptionEn, descriptionFi, itemId, index) => {
    selectRouteDescription(descriptionSv, descriptionEn, descriptionFi);
    setCultureRouteId(itemId);
    setActiveIndex(index);
    setShowCultureRoutes(true);
  };

  const walkingControlTypes = [
    {
      type: 'ecoCounterStations',
      msgId: 'mobilityPlatform.menu.showEcoCounter',
      checkedValue: showEcoCounter,
      onChangeValue: ecoCounterStationsToggle,
    },
    {
      type: 'cultureRoutes',
      msgId: 'mobilityPlatform.menu.showCultureRoutes',
      checkedValue: openCultureRouteList,
      onChangeValue: cultureRouteListToggle,
    },
  ];

  const bicycleControlTypes = [
    {
      type: 'bicycleStands',
      msgId: 'mobilityPlatform.menu.showBicycleStands',
      checkedValue: showBicycleStands,
      onChangeValue: bicycleStandsToggle,
    },
    {
      type: 'ecoCounterStations',
      msgId: 'mobilityPlatform.menu.showEcoCounter',
      checkedValue: showEcoCounter,
      onChangeValue: ecoCounterStationsToggle,
    },
  ];

  const carControlTypes = [
    {
      type: 'chargingStations',
      msgId: 'mobilityPlatform.menu.showChargingStations',
      checkedValue: showChargingStations,
      onChangeValue: chargingStationsToggle,
    },
    {
      type: 'gasFillingStations',
      msgId: 'mobilityPlatform.menu.showGasStations',
      checkedValue: showGasFillingStations,
      onChangeValue: gasFillingStationsToggle,
    },
  ];

  const formLabel = (keyVal, msgId, checkedValue, onChangeValue) => (
    <FormControlLabel
      key={keyVal}
      label={(
        <Typography variant="body2">
          {intl.formatMessage({
            id: msgId,
          })}
        </Typography>
      )}
      control={<Switch checked={checkedValue} onChange={onChangeValue} />}
      className={classes.formLabel}
    />
  );

  const buttonComponent = (onClickFunc, settingState, iconName, translationId) => (
    <Button
      onClick={() => onClickFunc()}
      variant="outlined"
      className={settingState ? classes.buttonActive : classes.button}
    >
      <ReactSVG className={settingState ? `${classes.iconActive}` : `${classes.icon}`} src={iconName} />
      <Typography variant="body2">
        {intl.formatMessage({
          id: translationId,
        })}
      </Typography>
    </Button>
  );

  const descriptionComponent = (
    <div className={classes.description}>
      <div className={classes.subtitle}>
        <Button
          className={classes.buttonWhite}
          onClick={() => (showDescriptionText ? setShowDescriptionText(false) : setShowDescriptionText(true))}
        >
          <Typography className={classes.toggleText} variant="body1">
            {intl.formatMessage({
              id: 'mobilityPlatform.info.description.title',
            })}
          </Typography>
          {showDescriptionText ? <ArrowDropUp /> : <ArrowDropDown />}
        </Button>
      </div>
      {showDescriptionText ? (
        <div className={classes.paragraph}>
          <Typography component="p" variant="body2">
            {cultureRouteDesc}
          </Typography>
        </div>
      ) : null}
    </div>
  );

  const renderList = inputData => inputData.map((item, i) => (
    <Button
      key={item.id}
      variant="outlined"
      className={i === activeIndex ? classes.buttonSmallActive : classes.buttonSmall}
      onClick={() => setCultureRouteState(item.description_sv, item.description_en, item.description, item.id, i)}
    >
      <Typography variant="body2">{selectRouteName(currentLocale, item.name, item.name_en, item.name_sv)}</Typography>
    </Button>
  ));

  return (
    <div className={classes.content}>
      <TitleBar
        title={intl.formatMessage({ id: 'general.pageTitles.mobilityPlatform.title' })}
        titleComponent="h3"
        backButton
        className={classes.topBarColor}
      />
      <div className={classes.container}>
        <>{cultureRouteDesc ? descriptionComponent : null}</>
        <FormControl variant="standard" className={classes.formControl}>
          <FormGroup className={classes.formGroup}>
            <>
              <div className={classes.buttonContainer}>
                {buttonComponent(walkSettingsToggle, openWalkSettings, iconWalk, 'mobilityPlatform.menu.title.walk')}
              </div>
              {openWalkSettings
                && walkingControlTypes.map(item => formLabel(item.type, item.msgId, item.checkedValue, item.onChangeValue))}
              {openCultureRouteList && (currentLocale === 'en' || currentLocale === 'sv')
                ? renderList(filteredCultureRouteList)
                : null}
              {openCultureRouteList && currentLocale === 'fi' ? renderList(cultureRouteList) : null}
              <div className={classes.buttonContainer}>
                {buttonComponent(
                  bicycleSettingsToggle,
                  openBicycleSettings,
                  iconBicycle,
                  'mobilityPlatform.menu.title.bicycle',
                )}
              </div>
              {openBicycleSettings
                && bicycleControlTypes.map(item => formLabel(item.type, item.msgId, item.checkedValue, item.onChangeValue))}
              <div className={classes.buttonContainer}>
                {buttonComponent(carSettingsToggle, openCarSettings, iconCar, 'mobilityPlatform.menu.title.car')}
              </div>
              {openCarSettings
                && carControlTypes.map(item => formLabel(item.type, item.msgId, item.checkedValue, item.onChangeValue))}
            </>
          </FormGroup>
        </FormControl>
      </div>
      {showEcoCounter ? <InfoTextBox infoText="mobilityPlatform.info.ecoCounter" /> : null}
      {showBicycleStands ? <InfoTextBox infoText="mobilityPlatform.info.bicycleStands" /> : null}
      {showChargingStations ? <InfoTextBox infoText="mobilityPlatform.info.chargingStations" /> : null}
      {showGasFillingStations ? <InfoTextBox infoText="mobilityPlatform.info.gasFillingStations" /> : null}
    </div>
  );
};

MobilitySettingsView.propTypes = {
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default MobilitySettingsView;
