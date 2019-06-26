/* eslint-disable @typescript-eslint/camelcase */
import * as express from 'express';
const router = express.Router();
import axios from 'axios';

import { handleUserProfile } from '../../controllers/oauth/google';
import { generateToken, getAuthRedirectURL } from '../../middleware/user-auth';
import {
  GoogleOauthTokenResponse,
  GoogleOauthProfileResponse,
} from '../../types';
import { generateAPIToken } from '../../utilities/jwt';
import { createEncUser, createVmtUser } from '../../controllers/localSignup';

router.get(
  '/google',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    try {
      let googleEndpoint = `https://accounts.google.com/o/oauth2/v2/auth`;

      let clientId = process.env.GOOGLE_CLIENT_ID;
      let responseType = 'code';
      let scope = 'profile%20email';
      let redirectURI = process.env.GOOGLE_CALLBACK_URL;
      let includeScopes = true;

      let url = `${googleEndpoint}?client_id=${clientId}&response_type=${responseType}&scope=${scope}&redirect_uri=${redirectURI}&include_granted_scopes=${includeScopes}`;

      res.cookie('redirectURL', getAuthRedirectURL(req));

      res.redirect(url);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  '/google/callback',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    try {
      let { code } = req.query;

      if (code === undefined) {
        return;
      }

      if (code) {
        // exchange code for access token
        let googleEndpoint = `https://www.googleapis.com/oauth2/v4/token`;
        let params = {
          code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: process.env.GOOGLE_CALLBACK_URL,
          grant_type: 'authorization_code',
        };

        let results = await axios.post(googleEndpoint, params);

        let resultsData: GoogleOauthTokenResponse = results.data;

        let { access_token } = resultsData;
        let userProfileEndpoint =
          'https://www.googleapis.com/oauth2/v3/userinfo';

        let config = {
          headers: { Authorization: 'Bearer ' + access_token },
        };

        let profileResults = await axios.get(userProfileEndpoint, config);

        let profile: GoogleOauthProfileResponse = profileResults.data;

        let mtUser = await handleUserProfile(profile);

        let apiToken = await generateAPIToken(mtUser._id);

        let [encUser, vmtUser] = await Promise.all([
          createEncUser(mtUser, req.body, apiToken),
          createVmtUser(mtUser, req.body, apiToken),
        ]);

        mtUser.encUserId = encUser._id;
        mtUser.vmtUserId = vmtUser._id;

        await mtUser.save();

        let token = await generateToken(mtUser);

        res.cookie('mtToken', token);

        let redirectURL = req.cookies.redirectURL || '/';

        res.redirect(redirectURL);
      }
    } catch (err) {
      next(err);
    }
  }
);

export default router;
