/* eslint-disable @typescript-eslint/camelcase */
import User from '../../models/User';
import { GoogleOauthProfileResponse, UserDocument } from '../../types';

export const handleUserProfile = async (
  userProfile: GoogleOauthProfileResponse
): Promise<UserDocument> => {
  let { sub, given_name, family_name, picture, email } = userProfile;

  // check if user exists already with username = to email

  let existingUser = await User.findOne({ username: email });

  if (existingUser !== null) {
    return existingUser;
  }

  return User.create({
    username: email,
    email,
    googleId: sub,
    firstName: given_name,
    lastName: family_name,
    googleProfilePic: picture,
  });
};
