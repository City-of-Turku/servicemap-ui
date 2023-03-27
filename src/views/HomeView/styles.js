import mapBackgroundTku from 'servicemap-ui-turku/assets/images/front-page-map-bg-tku.png';
import mapBackground from '../../assets/images/front-page-map-bg.png';

export default theme => ({
  background: {
    backgroundImage: `url(${mapBackground})`,
    backgroundSize: 'cover',
    flex: '1 1 auto',
  },
  backgroundTku: {
    backgroundImage: `url(${mapBackgroundTku})`,
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
});
