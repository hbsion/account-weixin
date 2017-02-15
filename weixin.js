Accounts.oauth.registerService('weixin');

if (Meteor.isClient) {
  Meteor.loginWithWeixin = function(options, callback) {
    // support a callback without options
    if (! callback && typeof options === "function") {
      callback = options;
      options = null;
    }

    var credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback);
    Weixin.requestCredential(options, credentialRequestCompleteCallback);
  };
} else {
  Accounts.addAutopublishFields({
    forLoggedInUser: ['services.weixin'],
    forOtherUsers: [
      'services.weixin.nickname',
      'services.weixin.openid',
    ],
  });
}