const { getUserFromLogin, generateToken } = require('../middleware/user-auth');

const jwtLogin = async (req, res, next) => {
  try {
    let { username, password } = req.body;

    let { user, errorMessage } = await getUserFromLogin(username, password);

    if (user === null) {
      // send error
      return res.json({
        user,
        message: errorMessage,
      });
    }

    let token = await generateToken(user);

    return res.json({
      user,
      message: errorMessage,
      mtToken: token,
    });
  } catch (err) {
    console.log('err', err);
    return res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = jwtLogin;
