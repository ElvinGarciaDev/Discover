// This middleware prevents the user from accessing any file if they are not logged in

module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) { // If the user is logged in, let them continue
      return next();
    } else {
      res.redirect("/");  // If not send them back to the login/hompage
    }
  },
  ensureGuest: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/dashboard");
    }
  },
};