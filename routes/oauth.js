const express = require('express');
const router = express.Router();
const axios = require('axios');

const { handleUserProfile } = require('../controllers/oauth/google');
const { generateToken } = require('../middleware/user-auth');

router.get('/google', async (req, res, next) => {
  try {
    let googleEndpoint = `https://accounts.google.com/o/oauth2/v2/auth`;

    let clientId = process.env.GOOGLE_CLIENT_ID;
    let responseType = 'code';
    let scope = 'profile%20email';
    let redirectURI = process.env.GOOGLE_CALLBACK_URL_DEV;
    let includeScopes = true;

    let url = `${googleEndpoint}?client_id=${clientId}&response_type=${responseType}&scope=${scope}&redirect_uri=${redirectURI}&include_granted_scopes=${includeScopes}`;

    res.redirect(url);
  } catch (err) {
    console.log('google err', err);
  }
});

router.get('/google/callback', async (req, res, next) => {
  try {
    let { code } = req.query;

    if (code) {
      // exchange code for access token
      let googleEndpoint = `https://www.googleapis.com/oauth2/v4/token`;
      let params = {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: 'http://localhost:3002/oauth/google/callback',
        grant_type: 'authorization_code',
      };

      let results = await axios.post(googleEndpoint, params);

      let { access_token } = results.data;
      let userProfileEndpoint = 'https://www.googleapis.com/oauth2/v3/userinfo';

      let config = {
        headers: { Authorization: 'Bearer ' + access_token },
      };

      let profileResults = await axios.get(userProfileEndpoint, config);

      let mtUser = await handleUserProfile(profileResults.data);
      let token = await generateToken(mtUser);

      res.cookie('mtToken', token);

      let redirectURL = req.cookies.mt_sso_redirect;

      return res.redirect(redirectURL);
    } else {
      next();
    }
  } catch (err) {
    console.log('err google callback', err);
  }
});

module.exports = router;
