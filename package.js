Package.describe({
  name: 'hbsion:account-weixin',
  version: '0.0.6',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.4.2.3');
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

  api.add_files('wechat_client.js', 'client');
  api.add_files('wechat_server.js', 'server');
  api.add_files("wechat.js");

  api.export('Wechat');
  api.add_files([
    'wechat_configuration.html',
    'wechat_configuration.js',
    'wechat_login_button.css'
  ],'client');
});