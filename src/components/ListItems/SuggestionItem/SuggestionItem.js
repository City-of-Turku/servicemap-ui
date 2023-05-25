import { Button, Divider, Typography } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { ArrowUpward } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { keyboardHandler } from '../../../utils';
import useMobileStatus from '../../../utils/isMobile';
import BoldedText from '../../BoldedText';

const SuggestionItem = (props) => {
  const {
    classes,
    className,
    divider,
    text,
    handleItemClick,
    handleRemoveClick,
    handleArrowClick,
    icon,
    selected,
    subtitle,
    query,
    role,
    id,
  } = props;

  const [mouseDown, setMouseDown] = useState(false);
  const isMobile = useMobileStatus();
  const onClick = handleItemClick
    ? (e) => {
      e.preventDefault();
      if (!mouseDown) {
        handleItemClick();
        setMouseDown(true);
      }
    } : null;

  return (
    <React.Fragment>
      <ListItem
        button
        component="li"
        classes={{
          root: classes.listItem,
          selected: classes.itemFocus,
        }}
        selected={selected}
        className={`suggestion ${className || ''}`}
        onMouseDown={onClick}
        onMouseUp={() => setMouseDown(false)}
        onKeyDown={keyboardHandler(onClick, ['space', 'enter'])}
        onKeyUp={() => setMouseDown(false)}
        onClick={() => handleItemClick()}
        role={role || 'link'}
        aria-label={`${text} ${subtitle || ''}`}
        id={id}
      >
        <span
          className={classes.container}
        >
          <ListItemIcon aria-hidden className={`${classes.listIcon}`}>
            {icon}
          </ListItemIcon>

          <ListItemText
            className={classes.text}
            classes={{ root: classes.textContainer }}
          >

            <Typography
              aria-hidden
              variant="body2"
            >
              {
                query
                  ? (
                    <BoldedText
                      text={text}
                      shouldBeBold={query}
                    />
                  ) : text
              }
            </Typography>
            {
            subtitle
            && (
              <Typography
                aria-hidden
                variant="body2"
                className={classes.subtitle}
              >
                {subtitle}
              </Typography>

            )
          }
          </ListItemText>
        </span>
        {handleRemoveClick && (
          <Button
            aria-hidden
            className={`${classes.suggestIcon}`}
            classes={{
              label: classes.suggestIconLabel,
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const value = text.props ? text.props.text : text;
              handleRemoveClick(value);
              return false;
            }}
          >
            <Typography variant="caption" className={classes.removeText}>
              <FormattedMessage id="search.removeSuggestion" />
            </Typography>
          </Button>
        )}
        {
          isMobile
          && handleArrowClick
          && (
            <Button
              aria-hidden
              className={`${classes.suggestIcon}`}
              classes={{
                label: classes.suggestIconLabel,
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const value = text.props ? text.props.text : text;
                handleArrowClick(value);
                return false;
              }}
            >
              <ArrowUpward style={{ transform: 'rotate(-48deg)' }} />
            </Button>
          )
        }
      </ListItem>
      {divider ? (
        <li aria-hidden>
          <Divider aria-hidden className={classes.divider} />
        </li>
      ) : null}
    </React.Fragment>
  );
};

export default SuggestionItem;

SuggestionItem.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  icon: PropTypes.objectOf(PropTypes.any),
  handleRemoveClick: PropTypes.func,
  handleArrowClick: PropTypes.func,
  handleItemClick: PropTypes.func,
  divider: PropTypes.bool,
  selected: PropTypes.bool,
  subtitle: PropTypes.string,
  query: PropTypes.string,
  role: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
};

SuggestionItem.defaultProps = {
  icon: null,
  handleArrowClick: null,
  handleRemoveClick: null,
  handleItemClick: null,
  divider: false,
  selected: false,
  subtitle: null,
  query: null,
  role: null,
  id: null,
  className: null,
};
