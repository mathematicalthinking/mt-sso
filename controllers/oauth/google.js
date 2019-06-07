const User = require('../../models/User');

const handleUserProfile = async userProfile => {
  let { sub, given_name, family_name, picture, email } = userProfile;

  // check if user exists already with username = to email

  let existingUser = await User.findOne({ username: email });

  if (existingUser !== null) {
    return existingUser;
  }

  return await User.create({
    username: email,
    email,
    googleId: sub,
    firstName: given_name,
    lastName: family_name,
    googleProfilePic: picture,
  });
  // new user; create new user
};

module.exports.handleUserProfile = handleUserProfile;
