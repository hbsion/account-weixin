Wechat = {};

Wechat.requestCredential = function (options, credentialRequestCompleteCallback) {
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  }

  var config = ServiceConfiguration.configurations.findOne({service: 'wechat'});
  if (!config) {
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(
      new ServiceConfiguration.ConfigError());
    return;
  }
  var credentialToken = Random.secret();
  var loginStyle = OAuth._loginStyle('wechat', config, options);
  var scope = (options && options.requestPermissions) || ['snsapi_userinfo'];
  var flatScope = _.map(scope, encodeURIComponent).join('+');
  var state = OAuth._stateParam(loginStyle,credentialToken);
  var loginUrl =
    'https://open.weixin.qq.com/connect/oauth2/authorize' +
      '?appid=' + config.appId +
      '&redirect_uri=' + OAuth._redirectUri('wechat', config) +
      '&response_type=code' +
      '&scope=' + flatScope +
      '&state=' + state;
      //'&state=' + OAuth._stateParam(loginStyle,credentialToken);

  OAuth.launchLogin({
    loginService: "wechat"
    , loginStyle: "redirect"
    , loginUrl: loginUrl
    , credentialRequestCompleteCallback: credentialRequestCompleteCallback
    , credentialToken: credentialToken
  });
};