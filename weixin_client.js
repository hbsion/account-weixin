Weixin = {};

Weixin.requestCredential = function (options, credentialRequestCompleteCallback) {
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  }

  var config = ServiceConfiguration.configurations.findOne({service: 'weixin'});
  if (!config) {
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(
      new ServiceConfiguration.ConfigError());
    return;
  }
  var credentialToken = Random.secret();
  var loginStyle = OAuth._loginStyle('weixin', config, options);
  var scope = (options && options.requestPermissions) || ['snsapi_userinfo'];
  var flatScope = _.map(scope, encodeURIComponent).join('+');
  var state = OAuth._stateParam(loginStyle,credentialToken, options && options.redirectUrl);
  var loginUrl =
    'https://open.weixin.qq.com/connect/oauth2/authorize' +
      '?appid=' + config.appId +
      '&redirect_uri=' + OAuth._redirectUri('weixin', config) +
      '&response_type=code' +
      '&scope=' + flatScope +
      '&state=' + state;
      //'&state=' + OAuth._stateParam(loginStyle,credentialToken);
  OAuth.launchLogin({
    loginService: "weixin"
    , loginStyle: "redirect"
    , loginUrl: loginUrl
    , credentialRequestCompleteCallback: credentialRequestCompleteCallback
    , credentialToken: credentialToken
  });
};