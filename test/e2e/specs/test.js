// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'default e2e tests': function test(browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL;

    browser.url(devServer, () => {
      browser.waitForElementVisible('#app', 5000);
      browser.expect.element('h1').text.to.equal('Hello');
      browser.assert.elementPresent('h1')
      browser.assert.elementCount('h1', 1)
      browser.end();
    });
  },
};
