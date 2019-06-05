const { getUserFromLogin, generateToken } = require('../middleware/user-auth');

const jwtLogin = async (req, res, next) => {
  let { username, password } = req.body;

  let { user, errorMessage } = await getUserFromLogin(username, password);

  if (user === null) {
    // send error
    res.render('index', { title: 'Express', loginError: errorMessage });
  }

  let token = await generateToken(user);

  let redirectURL = req.cookies.redirectURL;

  res.cookie('mtToken', token);

  res.redirect(redirectURL);
};

module.exports = jwtLogin;
