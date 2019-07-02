/* eslint-disable @typescript-eslint/camelcase */
import User from '../../models/User';
import { GoogleOauthProfileResponse, UserDocument } from '../../types';

export const handleUserProfile = async (
  userProfile: GoogleOauthProfileResponse,
): Promise<UserDocument> => {
  let { sub, given_name, family_name, picture, email } = userProfile;

  // check if user exists already with username = to email
  // or if user previously signed up locally with username / password but with same email

  let existingUser = await User.findOne({
    $or: [{ username: email }, { email }],
  });

  if (existingUser === null) {
    return User.create({
      username: email,
      email,
      googleId: sub,
      firstName: given_name,
      lastName: family_name,
      googleProfilePic: picture,
      isEmailConfirmed: true,
    });
  }

  if (typeof existingUser.googleId !== 'string') {
    // add google profile info to existing user
    existingUser.googleId = sub;

    // convenient naming for looping
    let googleProfilePic = picture;
    let firstName = given_name;
    let lastName = family_name;

    for (let detail of [firstName, lastName, googleProfilePic, email]) {
      // set google profile detail if not already set on existing user
      if (
        typeof detail === 'string' &&
        typeof existingUser[detail] !== 'string'
      ) {
        existingUser[detail] = detail;
      }
    }

    await existingUser.save();
  }
  return existingUser;
};
