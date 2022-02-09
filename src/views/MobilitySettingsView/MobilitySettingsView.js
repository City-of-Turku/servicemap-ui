import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Typography, FormGroup, FormControl, FormControlLabel, Switch, Button,
} from '@material-ui/core';
import { ReactSVG } from 'react-svg';
// eslint-disable-next-line import/no-named-as-default
import MobilityPlatformContext from '../../context/MobilityPlatformContext';
import TitleBar from '../../components/TitleBar';
import InfoTextBox from '../../components/MobilityPlatform/InfoTextBox';
import iconWalk from '../../../node_modules/servicemap-ui-turku/assets/icons/icons-icon_walk.svg';
import iconBicycle from '../../../node_modules/servicemap-ui-turku/assets/icons/icons-icon_bicycle.svg';
import iconCar from '../../../node_modules/servicemap-ui-turku/assets/icons/icons-icon_car.svg';

const MobilitySettingsView = ({ classes, intl }) => {
  const [openWalkSettings, setOpenWalkSettings] = useState(false);
  const [openBicycleSettings, setOpenBicycleSettings] = useState(false);
  const [openCarSettings, setOpenCarSettings] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);

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
  } = useContext(MobilityPlatformContext);

  // Set value to true. Only then it will fetch data.
  useEffect(() => {
    setOpenMobilityPlatform(true);
  }, [setOpenMobilityPlatform]);

  // Check if any visibility state is true after previous use.
  // Open correct toggle settings is one or more is true
  const checkVisibilityState = () => {
    if (showEcoCounter) {
      setOpenWalkSettings(true);
      setOpenBicycleSettings(true);
    } else if (showChargingStations || showGasFillingStations) {
      setOpenCarSettings(true);
    } else if (showBicycleStands) {
      setOpenBicycleSettings(true);
    }
  };

  useEffect(() => {
    checkVisibilityState();
  }, []);

  useEffect(() => {
    if (showBicycleStands || showChargingStations || showGasFillingStations || showEcoCounter) {
      setIsContentVisible(true);
    } else if (!showBicycleStands && !showChargingStations && !showGasFillingStations && !showEcoCounter) {
      setIsContentVisible(false);
    }
  }, [showBicycleStands, showChargingStations, showGasFillingStations, showEcoCounter]);

  // Toggle functions for user types
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
  const ChargingStationsToggle = () => {
    if (!showChargingStations) {
      setShowChargingStations(true);
    } else {
      setShowChargingStations(false);
    }
  };

  const GasFillingStationsToggle = () => {
    if (!showGasFillingStations) {
      setShowGasFillingStations(true);
    } else {
      setShowGasFillingStations(false);
    }
  };

  const EcoCounterStationsToggle = () => {
    if (!showEcoCounter) {
      setShowEcoCounter(true);
    } else {
      setShowEcoCounter(false);
    }
  };

  const BicycleStandsToggle = () => {
    if (!showBicycleStands) {
      setShowBicycleStands(true);
    } else {
      setShowBicycleStands(false);
    }
  };

  // Hides all visible markers
  const resetMarkers = () => {
    setShowBicycleStands(false);
    setShowChargingStations(false);
    setShowGasFillingStations(false);
    setShowEcoCounter(false);
  };

  // Array data for control types
  const walkingControlTypes = [
    {
      type: 'ecoCounterStations',
      msgId: 'mobilityPlatform.menu.showEcoCounter',
      checkedValue: showEcoCounter,
      onChangeValue: EcoCounterStationsToggle,
    },
  ];

  const bicycleControlTypes = [
    {
      type: 'ecoCounterStations',
      msgId: 'mobilityPlatform.menu.showEcoCounter',
      checkedValue: showEcoCounter,
      onChangeValue: EcoCounterStationsToggle,
    },
    {
      type: 'bicycleStands',
      msgId: 'mobilityPlatform.menu.showBicycleStands',
      checkedValue: showBicycleStands,
      onChangeValue: BicycleStandsToggle,
    },
  ];

  const carControlTypes = [
    {
      type: 'chargingStations',
      msgId: 'mobilityPlatform.menu.showChargingStations',
      checkedValue: showChargingStations,
      onChangeValue: ChargingStationsToggle,
    },
    {
      type: 'gasFillingStations',
      msgId: 'mobilityPlatform.menu.showGasStations',
      checkedValue: showGasFillingStations,
      onChangeValue: GasFillingStationsToggle,
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

  return (
    <div>
      <TitleBar
        title={intl.formatMessage({ id: 'general.pageTitles.mobilityPlatform.title' })}
        titleComponent="h3"
        backButton
        className={classes.topBarColor}
      />
      <div className={classes.container}>
        {isContentVisible ? (
          <div>
            <Button variant="outlined" onClick={() => resetMarkers()} className={classes.button}>
              <Typography variant="subtitle2" className={classes.buttonText}>
                {intl.formatMessage({ id: 'mobilityPlatform.menu.hideIcons' })}
              </Typography>
            </Button>
          </div>
        ) : (
          <div className={classes.border}>
            <Button disabled variant="outlined" className={classes.button}>
              <Typography variant="subtitle2" className={classes.buttonText}>
                {intl.formatMessage({ id: 'mobilityPlatform.menu.hideIcons' })}
              </Typography>
            </Button>
          </div>
        )}
        <FormControl variant="standard" className={classes.formControl}>
          <FormGroup className={classes.formGroup}>
            <>
              <div className={classes.buttonContainer}>
                {buttonComponent(walkSettingsToggle, openWalkSettings, iconWalk, 'mobilityPlatform.menu.title.walk')}
              </div>
              {openWalkSettings
                && walkingControlTypes.map(item => formLabel(item.type, item.msgId, item.checkedValue, item.onChangeValue))}
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
