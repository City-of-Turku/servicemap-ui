import React from 'react';
import PropTypes from 'prop-types';
import SMButton from '../../../../components/ServiceMapButton';
import Container from '../../../../components/Container';

/** Basic pagination functional component.
 * Renders number on buttons based on the length of items array and items per page value.
 * */

const Pagination = ({
  classes, intl, items, itemsPerPage, currentPage, setCurrentPage,
}) => {
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const paginationLinks = [];

  for (let i = 1; i <= totalPages; i += 1) {
    paginationLinks.push(
      <SMButton
        key={i}
        aria-label={intl.formatMessage({ id: 'general.pagination.page.number' }, { number: i })}
        onClick={() => setCurrentPage(i)}
        className={`${classes.button} ${currentPage === i ? classes.active : ''}`}
        variant="contained"
        role="link"
      >
        {i}
      </SMButton>,
    );
  }
  return <Container className={classes.pagination}>{paginationLinks}</Container>;
};

Pagination.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  items: PropTypes.arrayOf(PropTypes.any),
  itemsPerPage: PropTypes.number,
  currentPage: PropTypes.number,
  setCurrentPage: PropTypes.func.isRequired,
};

Pagination.defaultProps = {
  items: [],
  itemsPerPage: 5,
  currentPage: 1,
};

export default Pagination;
