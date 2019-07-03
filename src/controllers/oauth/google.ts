/* eslint-disable @typescript-eslint/camelcase */
import User from '../../models/User';
import { GoogleOauthProfileResponse, GoogleSignupResponse } from '../../types';

export const handleUserProfile = async (
  userProfile: GoogleOauthProfileResponse,
): Promise<GoogleSignupResponse> => {
  let { sub, given_name, family_name, picture, email } = userProfile;

  // check if user exists already with username = to email
  // or if user previously signed up locally with username / password but with same email

  let existingUser = await User.findOne({
    $or: [{ username: email }, { email }],
  });

  if (existingUser === null) {
    let mtUser = await User.create({
      username: email,
      email,
      googleId: sub,
      firstName: given_name,
      lastName: family_name,
      googleProfilePic: picture,
      isEmailConfirmed: true,
    });

    return {
      mtUser,
      message: null,
    };
  }

  // email already associated with an account

  return {
    mtUser: null,
    message: 'There is already an account associated with that email',
  };
};
