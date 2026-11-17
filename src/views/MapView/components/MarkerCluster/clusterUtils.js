import ReactDOMServer from 'react-dom/server';
import React from 'react';
import isClient from '../../../../utils';
import { getAddressFromUnit } from '../../../../utils/address';
import formatEventDate from '../../../../utils/events';
import { isEmbed } from '../../../../utils/path';

// Unit and entrance markers are reached via the result list, so only they are hidden.
// Cluster markers (see createAccessibleDivIcon) and other map markers (e.g. mobility platform
// layers) must stay focusable and visible to screen readers.
export const UNIT_MARKER_SELECTOR = '.unitMarker, .entranceMarker';

// Remove unit markers from keyboard and screen readers within the given map only
export const hideUnitMarkers = (map) => {
  const container = map?.getContainer?.();
  if (!container) return;
  container.querySelectorAll(UNIT_MARKER_SELECTOR).forEach((item) => {
    item.setAttribute('tabindex', '-1');
    item.setAttribute('aria-hidden', 'true');
  });
};

const DESCRIPTION_CLASS = 'marker-description';
let AccessibleDivIcon = null;
let descriptionIdCounter = 0;

/**
 * L.divIcon for a marker that is either a named button or hidden from assistive technology.
 *
 * options.ariaLabel: accessible name. Leaflet only uses options.alt for IMG icons, and adds
 * tabindex="0" and role="button" itself when the marker's keyboard option is true.
 * options.ariaDescription: optional text linked with aria-describedby through a hidden child.
 * Without ariaLabel the icon is hidden; the marker's keyboard option must then be false.
 *
 * Leaflet reuses the icon element when a marker's icon updates (e.g. cluster count changes),
 * so every attribute set here is also cleared when it no longer applies.
 */
export const createAccessibleDivIcon = (options) => {
  if (!AccessibleDivIcon) {
    AccessibleDivIcon = global.L.DivIcon.extend({
      createIcon(oldIcon) {
        const div = global.L.DivIcon.prototype.createIcon.call(this, oldIcon);
        const { ariaLabel, ariaDescription } = this.options;

        if (ariaLabel) {
          div.setAttribute('aria-label', ariaLabel);
          div.removeAttribute('aria-hidden');
        } else {
          div.removeAttribute('aria-label');
          div.removeAttribute('role');
          div.setAttribute('aria-hidden', 'true');
          div.setAttribute('tabindex', '-1');
        }

        // DivIcon replaces the element's content, so the description child is always new
        if (ariaLabel && ariaDescription) {
          descriptionIdCounter += 1;
          const description = document.createElement('span');
          description.id = `marker-description-${descriptionIdCounter}`;
          description.className = DESCRIPTION_CLASS;
          description.hidden = true;
          description.textContent = ariaDescription;
          div.appendChild(description);
          div.setAttribute('aria-describedby', description.id);
        } else {
          div.removeAttribute('aria-describedby');
        }
        return div;
      },
    });
  }
  return new AccessibleDivIcon(options);
};

const BUTTON_ACTIVATION_KEYS = ['Enter', ' '];

export const createMarkerClusterLayer = (
  createClusterCustomIcon,
  clusterMouseover,
  clusterMouseout,
  clusterAnimationend,
  showListOfUnits,
) => {
  if (!isClient()) {
    return null;
  }

  const clusterLayer = global.L.markerClusterGroup({
    animate: true,
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    iconCreateFunction: createClusterCustomIcon,
    maxClusterRadius: 40,
    removeOutsideVisibleBounds: true,
    zoomToBoundsOnClick: true,
  });

  clusterLayer.on('clustermouseover', (a) => {
    if (clusterMouseover && !isEmbed()) clusterMouseover(a);
  });
  // Add click events as alternative way to trigger hover events on mobile
  clusterLayer.on('clusterclick', (a) => {
    if (clusterMouseover && showListOfUnits()) {
      clusterMouseover(a);
    }
  });

  clusterLayer.on('clusterkeydown', (e) => {
    const { originalEvent, layer } = e;
    if (!BUTTON_ACTIVATION_KEYS.includes(originalEvent?.key)) return;
    originalEvent.preventDefault();
    if (clusterMouseover && showListOfUnits()) {
      clusterMouseover(e);
      layer.getPopup()?.getElement()?.querySelector('[role="link"]')?.focus();
      return;
    }
    clusterLayer._zoomOrSpiderfy({
      type: 'clusterkeypress',
      layer,
      originalEvent: { keyCode: 13 },
    });
  });

  // Hide unit markers from keyboard after clustering animations are done
  clusterLayer.on('animationend', (a) => {
    if (clusterAnimationend) clusterAnimationend(a);
    hideUnitMarkers(clusterLayer._map);
  });

  // Run clustermouseout function
  clusterLayer.on('clustermouseout', (a) => {
    if (clusterMouseout) clusterMouseout(a);
  });


  return clusterLayer;
};

export const createTooltipContent = (unit, classes, getLocaleText, distance) => (
  ReactDOMServer.renderToStaticMarkup(
    <div>
      <p className={classes.unitTooltipTitle}>{unit.name && getLocaleText(unit.name)}</p>
      <div className={classes.unitTooltipSubContainer}>
        {
          unit.street_address
          && (
            <p className={classes.unitTooltipSubtitle}>
              {typeof unit.street_address === 'string'
                ? unit.street_address
                : getLocaleText(unit.street_address)
              }
            </p>
          )
        }
        {
          distance
          && (
            <p className={classes.unitTooltipSubtitle}>
              {distance.distance}
              {distance.type}
            </p>
          )
        }
      </div>
    </div>,
  )
);


export const createPopupContent = (unit, classes, getLocaleText, distance, intl, isMobile) => (
  ReactDOMServer.renderToStaticMarkup(
    <div className={classes.unitTooltipWrapper}>
      <p className={classes.unitTooltipTitle}>{unit.name && getLocaleText(unit.name)}</p>
      {
        unit.street_address
        && (
          <p className={classes.unitTooltipSubtitle}>
            {getAddressFromUnit(unit, getLocaleText, intl)}
          </p>
        )
      }
      {
        distance
        && (
          <p className={`${classes.unitTooltipSubtitle} ${classes.unitTooltipCaption}`}>
            {intl.formatMessage({ id: 'unit.distance' })}
            {distance.distance}
            {distance.type}
          </p>
        )
      }
      {
      unit.events?.length
        ? (
          <div className={classes.unitTooltipEventContainer}>
            <hr className={classes.unitTooltipDivider} />
            <p className={classes.unitTooltipSubtitle}>
              {unit.events[0].name.fi}
            </p>
            <p className={`${classes.unitTooltipSubtitle} ${classes.unitTooltipCaption}`}>
              {formatEventDate(unit.events[0], intl)}
            </p>
          </div>
        ) : null
      }
      {isMobile && (
        <p className={classes.unitTooltipLink}>
          {intl.formatMessage({ id: 'unit.showInformation' })}
        </p>
      )}
    </div>,
  )
);
