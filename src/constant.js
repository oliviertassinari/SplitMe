
export default {
  APP_ANDROID_URL: 'https://play.google.com/store/apps/details?id=com.split.app',
  getAPP_IOS_URL: (locale) => {
    let localeFilterd = locale;

    if (locale.indexOf(['fr', 'us', 'gb']) === -1) {
      localeFilterd = 'gb';
    }

    return `https://itunes.apple.com/${
      localeFilterd}/app/splitme-friends-expenses/id1130782526?mt=8`;
  },
  PRODUCTPAINS_URL: 'https://productpains.com/product/splitme/',
};
