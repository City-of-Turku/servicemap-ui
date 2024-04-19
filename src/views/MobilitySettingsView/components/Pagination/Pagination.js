import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import styled from '@emotion/styled';
import { ButtonBase } from '@mui/material';

/** Basic pagination functional component.
 * Renders number on buttons based on the length of items array and items per page value.
 * */

const Pagination = ({
  items, itemsPerPage, currentPage, setCurrentPage,
}) => {
  const intl = useIntl();
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const paginationLinks = [];

  for (let i = 1; i <= totalPages; i += 1) {
    paginationLinks.push(
      <StyledButton
        key={i}
        isActive={currentPage === i}
        aria-label={intl.formatMessage({ id: 'general.pagination.page.number' }, { number: i })}
        aria-current={currentPage === i}
        onClick={() => setCurrentPage(i)}
        variant="contained"
        role="link"
      >
        {i}
      </StyledButton>,
    );
  }
  return <StyledContainer>{paginationLinks}</StyledContainer>;
};

const StyledContainer = styled.div(({ theme }) => ({
  flexDirection: 'row',
  margin: theme.spacing(1, 2),
  padding: theme.spacing(0.5),
}));

const StyledButton = styled(({ isActive, ...props }) => <ButtonBase {...props} />)(({ theme, isActive }) => ({
  margin: theme.spacing(0.5),
  height: 32,
  width: 32,
  minHeight: 32,
  minWidth: 32,
  border: `1px solid ${theme.palette.white.contrastText}`,
  borderRadius: 4,
  backgroundColor: isActive ? theme.palette.primary.main : theme.palette.white.main,
  color: isActive ? theme.palette.white.main : 'rgb(0, 0, 0)',
  '&:hover': {
    backgroundColor: isActive ? theme.palette.primary.main : '',
    color: isActive ? theme.palette.white.main : '',
  },
}));

Pagination.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
  })),
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
