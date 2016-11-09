exports.defaultPatch = function() {
  var webdriver = require('selenium-webdriver'),
    bstackCapabilities = {},
    bstackURL = 'http://hub.browserstack.com:80/wd/hub',
    build;
  for(var index in global.process.mainModule.children) {
    var module = global.process.mainModule.children[index];
    if(module.id && module.id.endsWith('selenium-webdriver/index.js')) {
      webdriver = require(module.id);
    }
  }
  if(webdriver) {
    build = webdriver.Builder.prototype.build;
  }


  return {
    addCapability: function(key, value) {
      bstackCapabilities[key] = value;
    },
    seleniumHost: function(host, port) {
      bstackURL = 'http://' + host + ':' + port + '/wd/hub';
    },
    patch: function() {
      if(webdriver && build) {
        webdriver.Builder.prototype.build = function() {
          var that = this;
          Object.keys(bstackCapabilities).forEach(function(key) {
            that.capabilities_.set(key, bstackCapabilities[key]);
          });
          this.url_ = bstackURL;
          return build.call(this);
        };
      }
    }
  };
};
