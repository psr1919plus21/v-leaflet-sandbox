/* eslint-disable no-unused-expressions */
// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'Map page': function test(browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL;

    browser.url(devServer, () => {
      browser.expect.element('#app').to.be.present;
      browser.expect.element('.map-wrapper').to.be.present;
      browser.end();
    });
  },
};
