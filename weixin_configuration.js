Template.configureLoginServiceDialogForWeixin.helpers({
  siteUrl: function () {
    return Meteor.absoluteUrl();
  }
});

Template.configureLoginServiceDialogForWeixin.fields = function () {
  return [
    {property: 'appId', label: 'APP Id'},
    {property: 'secret', label: 'APP Secret'}
  ];
};