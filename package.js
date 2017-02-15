Package.describe({
  name: 'hbsion:account-weixin',
  version: '0.1.0',
  summary: 'meteor accounts package for wechat, not need open.weixin.qq.com',
  git: 'https://github.com/hbsion/account-weixin.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.4.2.7');
  api.use('accounts-base', ['client', 'server']);
  api.imply('accounts-base', ['client', 'server']);
  api.use('accounts-oauth', ['client', 'server']);
  api.imply('accounts-oauth', ['client', 'server']);

  api.use('oauth', ['client', 'server']);
  api.use('oauth2', ['client', 'server']);
  api.use('http', ['server']);
  api.use('templating', 'client');
  api.use('underscore', 'server');
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);
  api.use('base64', 'client');

  api.add_files('weixin_client.js', 'client');
  api.add_files('weixin_server.js', 'server');
  api.add_files("weixin.js");

  api.export('Weixin');
  api.add_files([
    'weixin_configuration.html',
    'weixin_configuration.js',
    'weixin_login_button.css'
  ],'client');
});