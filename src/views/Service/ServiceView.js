import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { injectIntl, intlShape } from 'react-intl';
import TitleBar from '../../components/TitleBar/TitleBar';
import { generatePath } from '../../utils/path';
import { getLocaleString } from '../../redux/selectors/locale';
import { fetchServiceUnits } from '../../redux/actions/services';
import ResultList from '../../components/Lists/ResultList';

class ServiceView extends React.Component {
  constructor(props) {
    super(props);
    this.listTitle = React.createRef();
  }

  componentDidMount() {
    const { match, fetchServiceUnits, unitData } = this.props;
    const { params } = match;
    if (`${unitData.id}` !== params.service) {
      fetchServiceUnits(params.service);
    } else {
      this.listTitle.current.focus();
      // this.fitUnitsToMap(unitData);
    }
  }

  componentDidUpdate() {
    const { unitData, match } = this.props;
    const { params } = match;
    // Focus on title once units have been loaded
    if (unitData && unitData.id === params.service) {
      this.listTitle.current.focus();
      // this.fitUnitsToMap(unitData);
    }
  }

  handleClick = (e, item) => {
    const { history, match } = this.props;
    const { params } = match;
    const locale = params && params.lng;
    e.preventDefault();
    if (history && item) {
      history.push(generatePath('unit', locale, item.id));
    }
  }

  // Function to fit service units on map,
  // not used currently since might not be needed and might be problematic in some unti lists
  /* fitUnitsToMap = (unitData) => {
    const { map } = this.props;
    const bounds = [];
    unitData.units.results.forEach((unit) => {
      if (unit.object_type === 'unit' && unit.location && unit.location.coordinates) {
        bounds.push([unit.location.coordinates[1], unit.location.coordinates[0]]);
      }
    });
    map.fitBounds(bounds);
  } */

  render() {
    const {
      unitData, isLoading, getLocaleText, error, intl,
    } = this.props;
    if (isLoading) {
      return (
        <div>
          <p aria-live="polite">{intl.formatMessage({ id: 'general.loading' })}</p>
        </div>
      );
    }
    if (unitData.units) {
      const serviceUnits = unitData.units.results;
      serviceUnits.forEach((unit) => {
        unit.object_type = 'unit';
      });
      return (
        <div>
          <TitleBar titleRef={this.listTitle} title={getLocaleText(unitData.name)} />
          <ResultList
            listId="search-list"
            data={serviceUnits}
            title=""
            onItemClick={(e, item) => this.handleClick(e, item)}
          />
        </div>
      );
    } if (error) {
      return (
        <div>
          {error}
        </div>
      );
    }
    return (
      null
    );
  }
}

const mapStateToProps = (state) => {
  const isLoading = state.service.isFetching;
  const error = state.service.errorMessage;
  const unitData = state.service.data;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  const map = state.mapRef.leafletElement;
  return {
    isLoading,
    unitData,
    getLocaleText,
    error,
    map,
  };
};

export default withRouter(injectIntl(connect(
  mapStateToProps,
  { fetchServiceUnits },
)(ServiceView)));

ServiceView.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  history: PropTypes.objectOf(PropTypes.any),
  unitData: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.any),
    PropTypes.arrayOf(PropTypes.any),
  ]),
  error: PropTypes.string,
  isLoading: PropTypes.bool.isRequired,
  getLocaleText: PropTypes.func.isRequired,
  fetchServiceUnits: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  map: PropTypes.objectOf(PropTypes.any),
};

ServiceView.defaultProps = {
  match: {},
  history: {},
  unitData: {},
  error: null,
  map: null,
};
