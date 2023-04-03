import mapBackgroundTku from 'servicemap-ui-turku/assets/images/front-page-map-bg-tku.webp';
import mapBackground from '../../assets/images/front-page-map-bg.png';
import config from '../../../config';

export default (theme) => {
// If external theme (by Turku) is true, then can be used to select which background to render
  const externalTheme = config.themePKG;
  const isExternalTheme = !externalTheme || externalTheme === 'undefined' ? null : externalTheme;

  return {
    background: {
      backgroundImage: `url(${isExternalTheme ? mapBackgroundTku : mapBackground})`,
      backgroundSize: 'cover',
      flex: '1 1 auto',
    },
    container: {
      flex: 1,
      padding: 0,
    },
    iconButton: {
      flex: '1 0 auto',
      color: theme.palette.primary.main,
      padding: theme.spacing(1),
    },
    iconButtonLabel: {
      display: 'flex',
      flexDirection: 'column',
    },
    buttonContainer: {
      paddingLeft: 25,
      paddingRight: 25,
      paddingTop: 20,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    left: {
      textAlign: 'left',
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      marginTop: 24,
    },
    contentContainer: {
      width: '100%',
      backgroundColor: '#f6f6f6',
      border: '1px solid #000000',
    },
  };
};
