const { getUserFromLogin, generateToken } = require('../middleware/user-auth');

const jwtLogin = async (req, res, next) => {
  try {
    let { username, password } = req.body;

    let { user, errorMessage } = await getUserFromLogin(username, password);

    if (user === null) {
      // send error
      return res.render('login', {
        title: 'Log in to your Mathematical Thinking account',
        loginError: errorMessage,
      });
    }

    let token = await generateToken(user);

    res.cookie('mtToken', token);

    // if no valid redirectURL provided, redirect to home page
    let redirectURL = req.cookies.redirectURL || '/';
    return res.redirect(redirectURL);
  } catch (err) {
    console.log('err', err);
  }
};

module.exports = jwtLogin;