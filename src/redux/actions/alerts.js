import config from '../../../config';
import fetchAllPages from '../../utils/fetchAllPages';
import { alertErrors, alertNews } from './fetchDataActions';

// Thunk fetch
export const fetchNews = () => async (dispatch) => {
  // Actions
  const {
    isFetching, fetchSuccess, fetchError,
  } = alertNews;

  dispatch(isFetching());
  fetchAllPages(`${config.serviceMapAPI.root}${config.serviceMapAPI.version}/announcement/`)
    .then(results => dispatch(fetchSuccess(results)))
    .catch((e) => {
      dispatch(fetchError(e.message));
      console.warn('Error fetching news data:', e);
    });
};


// Thunk fetch
export const fetchErrors = () => async (dispatch) => {
  // Actions
  const {
    isFetching, fetchSuccess, fetchError,
  } = alertErrors;

  dispatch(isFetching());
  fetchAllPages(`${config.serviceMapAPI.root}${config.serviceMapAPI.version}/error_message/`)
    .then(results => dispatch(fetchSuccess(results)))
    .catch((e) => {
      dispatch(fetchError(e.message));
      console.warn('Error fetching news data:', e);
    });
};
