const setLocalizedLink = (locale, setLink, linkUrlSv, linkUrlEn, linkUrlFi) => {
  if (locale === 'sv') {
    setLink(linkUrlSv);
  } else if (locale === 'en') {
    setLink(linkUrlEn);
  } else setLink(linkUrlFi);
};

const isDataValid = (visibilityValue, data) => visibilityValue && data && data.length > 0;

const createIcon = icon => ({
  iconUrl: icon,
  iconSize: [45, 45],
});

export {
  setLocalizedLink,
  isDataValid,
  createIcon,
};
