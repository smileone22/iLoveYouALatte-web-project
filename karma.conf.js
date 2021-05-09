module.exports = function(config) {
    config.set({
      frameworks: ['mocha', 'chai'],
      files: ['test/**/*.js'],
      reporters: ['progress'],
      port: 10630,  
      colors: true,
      logLevel: config.LOG_INFO,
      browsers: ['ChromeHeadless'],
      autoWatch: false,
      // singleRun: false, // Karma captures browsers, runs the tests and exits
      concurrency: Infinity
    })
  }

  module.exports = function(config) {
    config.set({
      browsers: ['Chrome', 'ChromeHeadless', 'MyHeadlessChrome'],
  
      customLaunchers: {
        MyHeadlessChrome: {
          base: 'ChromeHeadless',
          flags: ['--disable-translate', '--disable-extensions', '--remote-debugging-port=9223']
        }
      },
    }
  };