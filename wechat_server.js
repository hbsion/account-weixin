Wechat = {};

OAuth.registerService('wechat', 2, null, function(query) {
  var response = getTokenResponse(query);
  var accessToken = response.access_token;
  //var identity = response.user;
  var identity = getIdentity(accessToken, response.openid);

  var serviceData = _.extend(identity, {accessToken: response.access_token});

  // include helpful fields from twitter
  var fields = _.pick(identity, Twitter.whitelistedFields);
  _.extend(serviceData, fields);

  return {
    serviceData: serviceData,
    options: {
      profile: { name: JSON.parse(identity).nickname },
      services: { wechat: JSON.parse(identity) }
    }
  };
});

var getTokenResponse = function (query) {
  var config = ServiceConfiguration.configurations.findOne({service: 'wechat'});

  if (!config)
    throw new ServiceConfiguration.ConfigError();

  var response;
  try {
    response = HTTP.get(
      "https://api.weixin.qq.com/sns/oauth2/access_token", {
        params: {
          appid: config.appId,
          secret: OAuth.openSecret(config.secret),
          grant_type: 'authorization_code',
          code: query.code,
        }
      });

    if (response.error) // if the http response was an error
        throw response.error;
    if (typeof response.content === "string")
        response.content = JSON.parse(response.content);
    if (response.content.error)
        throw response.content;
  } catch (err) {
    throw _.extend(new Error("Failed to complete OAuth handshake with Wechat. " + err.message),
                   {response: err.response});
  }

  return response.content;
};

var getIdentity = function (accessToken, openid) {
  try {
    response = HTTP.get(
      "https://api.weixin.qq.com/sns/userinfo",
      {params: {access_token: accessToken, openid: openid,lang:"zh_CN"}}).content;
    response.id = response.openid;
    return response;
  } catch (err) {
    throw _.extend(new Error("Failed to fetch identity from Wechat. " + err.message),
                   {response: err.response});
  }
};

Wechat.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};