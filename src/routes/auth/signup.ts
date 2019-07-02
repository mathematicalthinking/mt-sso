import express from 'express';
const router = express.Router();

import {
  createBaseUser,
  encSignup,
  vmtSignup,
} from '../../controllers/localSignup';
import { validateVmtSignup, validateEncSignup } from '../../validators/signup';
import {
  verifySignupCredentialsAvailability as verifyCredentials,
  hashSignupPassword,
} from '../../middleware/user-auth';

router.post(
  '/enc',
  validateEncSignup,
  verifyCredentials,
  hashSignupPassword,
  createBaseUser,
  encSignup,
);

router.post(
  '/vmt',
  validateVmtSignup,
  verifyCredentials,
  hashSignupPassword,
  createBaseUser,
  vmtSignup,
);

export default router;
