Weixin = {};

OAuth.registerService('weixin', 2, null, function(query) {
  var response = getTokenResponse(query);
  var accessToken = response.access_token;
  var identity = {};
  
  if(response.scope == 'snsapi_userinfo') identity = JSON.parse(getIdentity(accessToken, response.openid));

  var serviceData = _.extend({
    id: response.openid,
    openid: response.openid,
    accessToken: response.access_token,
    expiresAt: (+new Date) + (1000 * response.expires_in)
  },identity);


  var profile = {openid:response.openid};

  if(response.scope == 'snsapi_userinfo'){
    profile.name = identity.nickname;
    profile.avatar = identity.headimgurl;
  }

  return {
    serviceData: serviceData,
    options: {
      profile: profile,
      services: { weixin: identity }
    }
  };
});

var getTokenResponse = function (query) {
  var config = ServiceConfiguration.configurations.findOne({service: 'weixin'});

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
    throw _.extend(new Error("Failed to complete OAuth handshake with Weixin. " + err.message),
                   {response: err.response});
  }

  return response.content;
};

var getIdentity = function (accessToken, openid) {
  try {
    Identity_temp = HTTP.get(
      "https://api.weixin.qq.com/sns/userinfo",
      {params: {access_token: accessToken, openid: openid,lang:"zh_CN"}}).content;
    return Identity_temp;
  } catch (err) {
    throw _.extend(new Error("Failed to fetch identity from Weixin. " + err.message),
                   {response: err.response});
  }
};

Weixin.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};