module.exports = function(app, passport){

  // Routes
  // router middelware
  function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
    res.redirect('/')
  }

  // Index
  app.get('/', function(req, res){
    res.render('index', { message: req.flash('loginMessage') });
  });

  // Index
  app.post('/', passport.authenticate('local-login', {
    successRedirect : '/secret',
    failureRedirect : '/',
    failureFlash: true
  }));

  // Sign up
  app.get('/signup', function(req, res){
    res.render('signup', { message: req.flash('loginMessage') });
  });

  // Sign up
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/secret',
    failureRedirect : '/signup',
    failureFlash: true
  }));

  // // Log in
  // app.get('/login', function(req, res){
  //   res.render('login', { message: req.flash('loginMessage') });
  // });
  //
  // // Log in
  // app.post('/login', passport.authenticate('local-login', {
  //   successRedirect : '/secret',
  //   failureRedirect : '/login',
  //   failureFlash: true
  // }));

  // Facebook Login
  app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
  app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/index' }), (req, res) => {
    res.redirect(req.session.returnTo || '/secret');
  });

  // Twitter Login
  app.get('/auth/twitter', passport.authenticate('twitter'));
  app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/index' }), (req, res) => {
    res.redirect(req.session.returnTo || '/secret');
  });

  // Instagram Login
  app.get('/auth/instagram', passport.authenticate('instagram'));
  app.get('/auth/instagram/callback', passport.authenticate('instagram', { failureRedirect: '/index' }), (req, res) => {
    res.redirect(req.session.returnTo || '/secret');
  });

  // Google Login
  app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));
  app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/index' }), (req, res) => {
    res.redirect(req.session.returnTo || '/secret');
  });

  // Secret
  app.get('/secret', isLoggedIn, function(req, res){
    res.render('secret', { message: req.flash('loginMessage') });
  });

  // logout
  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
}
