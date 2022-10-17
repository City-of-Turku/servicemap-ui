const setLocalizedLink = (locale, setLink, linkUrlSv, linkUrlEn, linkUrlFi) => {
  if (locale === 'sv') {
    setLink(linkUrlSv);
  } else if (locale === 'en') {
    setLink(linkUrlEn);
  } else setLink(linkUrlFi);
};

const isDataValid = (visibilityValue, data) => {
  return visibilityValue && data && data.length > 0;
};

export {
  setLocalizedLink,
  isDataValid,
};
