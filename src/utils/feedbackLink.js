const serviceMapFeedbackUrls = {
  fi: 'https://turku.asiointi.fi/eFeedback/fi/Feedback/30/1127',
  en: 'https://turku.asiointi.fi/eFeedback/en/Feedback/30/1127',
  sv: 'https://turku.asiointi.fi/eFeedback/sv/Feedback/30/1127',
};

const getServiceMapFeedbackUrl = (locale = 'fi') => (
  serviceMapFeedbackUrls[locale] || serviceMapFeedbackUrls.fi
);

export { serviceMapFeedbackUrls, getServiceMapFeedbackUrl };
