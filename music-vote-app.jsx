Albums = new Mongo.Collection("recordings");

if (Meteor.isClient) {
  // code executed by client
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

  Meteor.startup(function() {
    React.render(<App />, document.getElementById('content'));
    //React.render(<Routes />, document.getElementById('content'));
  });
}
