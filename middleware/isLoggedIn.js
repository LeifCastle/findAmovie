function isLoggedIn(req, res, next) {
  if (!req.user) {
    req.flash("error", "You must be signed in to access page");
    res.redirect("/account/login");
  } else {
    next();
  }
}

module.exports = isLoggedIn;
