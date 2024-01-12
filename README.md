# MT-SSO [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

MT-SSO is a Single-Sign-On authentication system for [EnCOMPASS](https://github.com/mathematicalthinking/encompass) and [VMT](https://github.com/mathematicalthinking/vmt)

## Installation (Technologies used)
- [MongoDB](http://www.mongodb.org/),
- [Express](http://expressjs.com/),
- [Node.js](http://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)


### Use node v10.18.0

## SETUP
- Fork repo from https://github.com/mathematicalthinking/mt-sso
- Clone forked repository to local machine (git clone <repo url>
- cd mt-sso
- git remote add upstream https://github.com/mathematicalthinking/mt-sso
- git remote -v to see remotes
- npm install -g typescript
- npm install
- cp .env.example .env
- Fill in .env variables
- npm run dev
