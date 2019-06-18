var Seeder = require('mongoose-data-seed').Seeder;
var User = require('../models/User');

var data = [
  /* 3 */
  {
    _id: '5d0901bb815f01ac870b1980',
    isTrashed: false,
    isEmailConfirmed: false,
    doForcePasswordChange: false,
    username: 'jsilverman',
    encUserId: '529646eae4bad7087700014d',
    createdAt: '2018-08-12T18:20:51.382Z',
    updatedAt: '2018-08-12T18:20:51.382Z',
    __v: 0,
  },

  /* 4 */
  {
    _id: '5d0901bb815f01ac870b1981',
    isTrashed: false,
    isEmailConfirmed: false,
    doForcePasswordChange: false,
    username: 'candice.roberts',
    encUserId: '52a88def729e9ef59ba7eb4c',
    createdAt: '2018-08-12T18:20:51.382Z',
    updatedAt: '2018-08-12T18:20:51.382Z',
    __v: 0,
  },

  /* 5 */
  {
    _id: '5d0901bb815f01ac870b1982',
    isTrashed: false,
    isEmailConfirmed: false,
    doForcePasswordChange: false,
    username: 'wes',
    encUserId: '52a88ae2729e9ef59ba7eb4b',
    createdAt: '2018-08-12T18:20:51.382Z',
    updatedAt: '2018-08-12T18:20:51.382Z',
    __v: 0,
  },

  /* 6 */
  {
    _id: '5d0901bb815f01ac870b1983',
    isTrashed: false,
    isEmailConfirmed: false,
    doForcePasswordChange: false,
    username: 'absvalteaching',
    encUserId: '53a43f7c729e9ef59ba7ebf2',
    createdAt: '2018-08-12T18:20:51.382Z',
    updatedAt: '2018-08-12T18:20:51.382Z',
    __v: 0,
  },

  /* 7 */
  {
    _id: '5d0901bb815f01ac870b1984',
    isTrashed: false,
    isEmailConfirmed: false,
    doForcePasswordChange: false,
    username: 'maxray',
    encUserId: '52964714e4bad7087700014e',
    createdAt: '2018-08-12T18:20:51.382Z',
    updatedAt: '2018-08-12T18:20:51.382Z',
    __v: 0,
  },

  /* 8 */
  {
    _id: '5d0901bb815f01ac870b1985',
    isTrashed: false,
    isEmailConfirmed: false,
    doForcePasswordChange: false,
    username: 'vklein',
    encUserId: '52b05fae729e9ef59ba7eb4d',
    createdAt: '2018-08-12T18:20:51.382Z',
    updatedAt: '2018-08-12T18:20:51.382Z',
    __v: 0,
  },

  /* 9 */
  {
    _id: '5d0901bb815f01ac870b1986',
    isTrashed: false,
    isEmailConfirmed: false,
    doForcePasswordChange: false,
    username: 'matraa57',
    encUserId: '52a8823d729e9ef59ba7eb4a',
    createdAt: '2018-08-12T18:20:51.382Z',
    updatedAt: '2018-08-12T18:20:51.382Z',
    __v: 0,
  },

  /* 10 */
  {
    _id: '5d0901bb815f01ac870b1987',
    isTrashed: false,
    isEmailConfirmed: false,
    doForcePasswordChange: false,
    username: 'dsl44',
    encUserId: '5370dc9c8f3e3d1f21000022',
    createdAt: '2018-08-12T18:20:51.382Z',
    updatedAt: '2018-08-12T18:20:51.382Z',
    __v: 0,
  },

  /* 11 */
  {
    _id: '5d0901bb815f01ac870b1988',
    isTrashed: false,
    isEmailConfirmed: false,
    doForcePasswordChange: false,
    username: 'steve',
    encUserId: '529518daba1cd3d8c4013344',
    createdAt: '2018-08-12T18:20:51.382Z',
    updatedAt: '2018-08-12T18:20:51.382Z',
    __v: 0,
  },

  /* 12 */
  {
    _id: '5d0901bb815f01ac870b1989',
    isTrashed: false,
    isEmailConfirmed: false,
    doForcePasswordChange: false,
    username: 'hle22',
    encUserId: '53a355a932f2863240000026',
    createdAt: '2018-08-12T18:20:51.382Z',
    updatedAt: '2018-08-12T18:20:51.382Z',
    __v: 0,
  },

  /* 13 */
  {
    _id: '5d0901bb815f01ac870b198b',
    isTrashed: false,
    isEmailConfirmed: false,
    doForcePasswordChange: false,
    username: 'alex8',
    password: '$2a$12$VJaCSw8ISla5ntkNL07qjuF.rU/ZV3xgmbnAyEbyUEN.acBOnavym',
    encUserId: '5b913ea33add43b868ae9805',
    createdAt: '2018-09-05T20:57:31.730Z',
    updatedAt: '2018-09-05T20:57:31.730Z',
    __v: 0,
  },

  /* 14 */
  {
    _id: '5d0901bb815f01ac870b198a',
    isTrashed: false,
    isEmailConfirmed: false,
    doForcePasswordChange: false,
    username: 'salejandre',
    encUserId: '53d274a032f2863240001a71',
    createdAt: '2018-08-12T18:20:51.382Z',
    updatedAt: '2018-08-12T18:20:51.382Z',
    __v: 0,
  },

  /* 15 */
  {
    _id: '5d0901bb815f01ac870b198c',
    isTrashed: false,
    isEmailConfirmed: true,
    doForcePasswordChange: false,
    username: 'mentort1',
    password: '$2a$12$wMVOnFgZlQpX6nBRQ9MlNe24I/u.i/nb3fN4XZSyAsnqX48KEkQdi',
    encUserId: '5c6f4075b1ccdf96abab26fe',
    email: 'pjt@fakeemail.com',
    createdAt: '2019-02-21T23:14:33.392Z',
    updatedAt: '2019-02-21T23:14:33.392Z',
    confirmEmailExpires: '2019-02-23T00:21:09.802Z',
    confirmEmailToken: '013f431a524e78f172c09fbed708b1351e5ebc16',
    googleId: null,
    __v: 0,
  },

  /* 16 */
  {
    _id: '5d0901bb815f01ac870b198d',
    isTrashed: false,
    isEmailConfirmed: false,
    doForcePasswordChange: false,
    username: 'student1',
    encUserId: '5b368afdca1375a94fabde39',
    createdAt: '2018-08-16T10:20:51.382Z',
    updatedAt: '2018-08-16T10:20:51.382Z',
    __v: 0,
  },

  /* 17 */
  {
    _id: '5d0901bb815f01ac870b198e',
    isTrashed: false,
    isEmailConfirmed: false,
    doForcePasswordChange: false,
    username: 'mtgstudent1',
    password: '$2a$12$VHxAuasK/L/9F/vJiAXtNewhM9xCAYXrJtbtG41M25QAoXkXb.8o.',
    encUserId: '5c6eb49c9852e5710311d634',
    createdAt: '2019-02-21T13:00:49.191Z',
    updatedAt: '2019-02-21T13:00:49.191Z',
    __v: 0,
  },

  /* 18 */
  {
    _id: '5d0901bb815f01ac870b198f',
    isTrashed: false,
    isEmailConfirmed: false,
    doForcePasswordChange: false,
    username: 'jamie4',
    password: '$2a$12$9yHQw56mEBj/3RdMj/1ohuF1pjxk9s.Jq6fBGAYqBs/wPwVyAvYR2',
    encUserId: '5b913ebe3add43b868ae9807',
    createdAt: '2018-09-05T20:57:31.730Z',
    updatedAt: '2018-09-05T20:57:31.730Z',
    __v: 0,
  },

  /* 19 */
  {
    _id: '5d0901bb815f01ac870b1991',
    isTrashed: false,
    isEmailConfirmed: true,
    doForcePasswordChange: false,
    username: 'mentort2',
    password: '$2a$12$VGI3xp8WTtlOmEcPjmWbKOIKvVVyEfGElVwhQFSs31LnW.Q2hAw7i',
    encUserId: '5c6f40deb1ccdf96abab26ff',
    email: 'jmt2@fakeemail.com',
    createdAt: '2019-02-21T23:14:33.392Z',
    updatedAt: '2019-02-21T23:14:33.392Z',
    confirmEmailExpires: '2019-02-23T00:22:54.736Z',
    confirmEmailToken: '78935e8863e019c7dc24d9b17c26d3a1e9c0cb0e',
    googleId: null,
    __v: 0,
  },

  /* 20 */
  {
    _id: '5d0901bb815f01ac870b1990',
    isTrashed: false,
    isEmailConfirmed: false,
    doForcePasswordChange: false,
    username: 'perryu',
    password: '$2a112$11.0QW/dcY.O/wqfkzKLf.D.4i02m4Ypa0fHTqcqivJD.bxLn6NLa',
    encUserId: '5b72e6465b50ea3fe3d1623c',
    email: 'encmath2@gmail.com',
    createdAt: '2018-08-14T18:20:51.382Z',
    updatedAt: '2018-08-14T18:20:51.382Z',
    confirmEmailExpires: '2018-08-12T21:13:47.107Z',
    confirmEmailToken: '62y9f60x9b2513f785f62fdt41f924630339968f',
    __v: 0,
  },

  /* 21 */
  {
    _id: '5d0901bb815f01ac870b1992',
    isTrashed: false,
    isEmailConfirmed: false,
    doForcePasswordChange: false,
    username: 'mr_stadel',
    encUserId: '52a695c2cc319831440007d0',
    createdAt: '2014-08-04T15:55:20.985Z',
    updatedAt: '2014-08-04T15:55:20.985Z',
    __v: 0,
  },

  /* 22 */
  {
    _id: '5d0901bb815f01ac870b1993',
    isTrashed: false,
    isEmailConfirmed: false,
    doForcePasswordChange: false,
    username: 'superuser',
    encUserId: '5b1e758ba5d2157ef4c90b2d',
    email: 'superuser@fakeemail.com',
    createdAt: '2018-08-14T18:20:51.382Z',
    updatedAt: '2018-08-14T18:20:51.382Z',
    __v: 0,
  },

  /* 23 */
  {
    _id: '5d0901bb815f01ac870b1994',
    isTrashed: false,
    isEmailConfirmed: false,
    doForcePasswordChange: false,
    username: 'ashleyc',
    password: '$2a$12$X7PKqTfa/ydePAKPNGGd4ObP9W6NSE34Cdwf3dYpT2BJh3oA2mSda',
    encUserId: '5b9149c22ecaf7c30dd47490',
    createdAt: '2018-09-06T15:30:21.278Z',
    updatedAt: '2018-09-06T15:30:21.278Z',
    __v: 0,
  },

  /* 24 */
  {
    _id: '5d0901bb815f01ac870b1995',
    isTrashed: false,
    isEmailConfirmed: true,
    doForcePasswordChange: false,
    username: 'mentorpd',
    password: '$2a$12$suZ74.AaY7AFS9sasRtqSOrUsmhFwOiAImP83i6CC0.EDcs1dHoaC',
    encUserId: '5c6f4032b1ccdf96abab26fd',
    email: 'ampd@fakeemail.com',
    createdAt: '2019-02-21T23:14:33.392Z',
    updatedAt: '2019-02-21T23:14:33.392Z',
    confirmEmailExpires: '2019-02-23T00:20:02.994Z',
    confirmEmailToken: '02291f71aad0968537c44d61d5dda21453ba4786',
    googleId: null,
    __v: 0,
  },

  /* 25 */
  {
    _id: '5d0901bb815f01ac870b1996',
    isTrashed: false,
    isEmailConfirmed: false,
    doForcePasswordChange: false,
    username: 'testUser',
    encUserId: '5b3688218610e3bfecca403c',
    createdAt: '2018-08-12T18:20:51.382Z',
    updatedAt: '2018-08-12T18:20:51.382Z',
    __v: 0,
  },

  /* 26 */
  {
    _id: '5d0901bb815f01ac870b1997',
    isTrashed: false,
    isEmailConfirmed: true,
    doForcePasswordChange: false,
    username: 'actingstudent',
    password: '$2a$12$gPUKBtiXwchWW5Y/aBApcei3J69hV23pZDBQOFf4phK98uFdIzcwW',
    encUserId: '5b99146e25b620610ceead75',
    email: 'al@fakeemail.com',
    createdAt: '2018-09-12T02:41:40.407Z',
    updatedAt: '2018-09-12T02:41:40.407Z',
    confirmEmailExpires: '2018-09-13T13:28:14.336Z',
    confirmEmailToken: '877b58517e38015753f98d0e7f6594b31c3cc162',
    __v: 0,
  },

  /* 27 */
  {
    _id: '5d0901bb815f01ac870b1998',
    isTrashed: false,
    isEmailConfirmed: true,
    doForcePasswordChange: false,
    username: 'tpool',
    password: '$2a$12$WA5cZStBrgopuQ1xD6RS2eO9EtNYHiBiQp137DdWgEldG5SSIpSJW',
    encUserId: '5ba7bedd2b7ba22c38a554fc',
    email: 'tpool@fakeemail.com',
    createdAt: '2018-09-23T14:55:15.655Z',
    updatedAt: '2018-09-23T14:55:15.655Z',
    confirmEmailExpires: '2018-09-24T16:27:09.309Z',
    confirmEmailToken: 'b0d1c5208859919cdf1dd0b55bbe2e5de5c88e2c',
    googleId: null,
    __v: 0,
  },

  /* 28 */
  {
    _id: '5d0901bb815f01ac870b1999',
    isTrashed: false,
    isEmailConfirmed: false,
    doForcePasswordChange: false,
    username: 'mrs. wren',
    encUserId: '53d9a577729e9ef59ba7f118',
    createdAt: '2018-08-12T18:20:51.382Z',
    updatedAt: '2018-08-12T18:20:51.382Z',
    __v: 0,
  },

  /* 29 */
  {
    _id: '5d0901bb815f01ac870b199a',
    isTrashed: false,
    isEmailConfirmed: true,
    doForcePasswordChange: false,
    username: 'teachertaylor',
    password: '$2a$12$p.4iz7z06yQdV4kyUAmq6.jG2Z0CHCCoyQppY21x8j5WhmcyDLxPG',
    encUserId: '5b914a802ecaf7c30dd47493',
    email: 'taylor@fakeemail.com',
    createdAt: '2018-09-06T15:30:21.278Z',
    updatedAt: '2018-09-06T15:30:21.278Z',
    confirmEmailExpires: '2018-09-07T15:40:48.142Z',
    confirmEmailToken: '329ff40a5d27344c6681d2d93bc1f628d71501fe',
    __v: 0,
  },

  /* 30 */
  {
    _id: '5d0901bb815f01ac870b199c',
    isTrashed: false,
    isEmailConfirmed: true,
    doForcePasswordChange: false,
    username: 'alice42',
    password: '$2a$08$Puko.4Ukg3fUVSfQsyhlauvFJ84/ymtidiL8qablVfic59zzC4gFi',
    encUserId: '5b72273c5b50ea3fe3d01a0b',
    createdAt: '2018-08-12T18:20:51.382Z',
    updatedAt: '2018-08-12T18:20:51.382Z',
    resetPasswordToken: '64a9360d9bf51cfc85662fd845c964680d39768e',
    resetPasswordExpires: '2088-08-14T21:13:47.107Z',
    __v: 0,
  },

  /* 31 */
  {
    _id: '5d0901bb815f01ac870b199b',
    isTrashed: false,
    isEmailConfirmed: true,
    doForcePasswordChange: false,
    username: 'mtgteacher',
    password: '$2a$12$jX8lx.4o2CMShsuMQHjfueR7sdf5ORrf3RGWO0yeHHMeLJoL55r2y',
    encUserId: '5c6eb45d9852e5710311d633',
    email: 'alex@mtgfake.com',
    createdAt: '2019-02-21T13:00:49.191Z',
    updatedAt: '2019-02-21T13:00:49.191Z',
    confirmEmailExpires: '2019-02-22T14:23:25.864Z',
    confirmEmailToken: '3a9571cf158344cb6c621949bcfc1ceef6865903',
    googleId: null,
    __v: 0,
  },

  /* 32 */
  {
    _id: '5d0901bb815f01ac870b199d',
    isTrashed: false,
    isEmailConfirmed: false,
    doForcePasswordChange: false,
    username: 'mtgstudent2',
    password: '$2a$12$n4fBSZGf87HDoHIZiS1IiuMkcMjPAHFtORvQ07vS6CeO94Qe4SPR.',
    encUserId: '5c6eb4ac9852e5710311d635',
    createdAt: '2019-02-21T13:00:49.191Z',
    updatedAt: '2019-02-21T13:00:49.191Z',
    __v: 0,
  },

  /* 33 */
  {
    _id: '5d0901bb815f01ac870b199e',
    isTrashed: false,
    isEmailConfirmed: true,
    doForcePasswordChange: false,
    username: 'morty',
    password: '$2a$08$Puko.4Ukg3fUVSfQsyhlauvEJ84/ymUidiL7xablVfic59zzC4gFi',
    encUserId: '5b245841ac75842be3189526',
    createdAt: '2018-08-17T10:20:51.382Z',
    updatedAt: '2018-08-17T10:20:51.382Z',
    __v: 0,
  },

  /* 34 */
  {
    _id: '5d0901bb815f01ac870b199f',
    isTrashed: false,
    isEmailConfirmed: false,
    doForcePasswordChange: false,
    username: 'perryz',
    password: '$2a$12$q1.0QW/dcY.OzwqfkzKLf.D.4i02m4Ypa0fHTqcqivJD.bxLn6NLa',
    encUserId: '5b72e05ba459749f7d9c1709',
    email: 'encmath2@gmail.com',
    createdAt: '2018-08-12T18:20:51.382Z',
    updatedAt: '2018-08-12T18:20:51.382Z',
    confirmEmailExpires: '2088-08-12T21:13:47.107Z',
    confirmEmailToken: '64y9r60x9b2513f785q62fdt45c924630339968e',
    __v: 0,
  },

  /* 35 */
  {
    _id: '5d0901bb815f01ac870b19a0',
    isTrashed: false,
    isEmailConfirmed: true,
    doForcePasswordChange: false,
    username: 'eeyore',
    password: '$2a$08$Puko.4Ukg3yUVSfQsyhlauvFJ/4/ymtidiL8qab.Vfic59zzC4gFi',
    encUserId: '5b72278b5b50ea3fe3d01a34',
    createdAt: '2018-08-12T18:20:51.382Z',
    updatedAt: '2018-08-12T18:20:51.382Z',
    resetPasswordToken: '64f9r60x9b2513f785q62fd845c964680d39768e',
    resetPasswordExpires: '2018-08-12T21:13:47.107Z',
    __v: 0,
  },

  /* 36 */
  {
    _id: '5d0901bb815f01ac870b19a1',
    isTrashed: false,
    isEmailConfirmed: false,
    doForcePasswordChange: false,
    username: 'mtgstudent3',
    password: '$2a$12$ecQid5ydhJfIIpwp9R4bROEu5SIQ/VS81MweEymT07Jp2vfy/aBVq',
    encUserId: '5c6eb4c19852e5710311d636',
    createdAt: '2019-02-21T13:00:49.191Z',
    updatedAt: '2019-02-21T13:00:49.191Z',
    __v: 0,
  },

  /* 37 */
  {
    _id: '5d0901bb815f01ac870b19a2',
    isTrashed: false,
    isEmailConfirmed: false,
    doForcePasswordChange: false,
    username: 'testUser2',
    encUserId: '5b4e5180a2eed65e2434d475',
    createdAt: '2018-08-12T18:20:51.382Z',
    updatedAt: '2018-08-12T18:20:51.382Z',
    __v: 0,
  },

  /* 38 */
  {
    _id: '5d0901bb815f01ac870b19a3',
    isTrashed: false,
    isEmailConfirmed: true,
    doForcePasswordChange: false,
    username: 'testfix',
    password: '$2a$12$nQafJwfxx19P2vyBhDLXUeDFNdZU81t1eosZEvs.plyCP1HNSZFtW',
    encUserId: '52964653e4bad7087700014b',
    email: 'testfix@test.com',
    createdAt: '2018-08-14T18:20:51.382Z',
    updatedAt: '2018-08-14T18:20:51.382Z',
    __v: 0,
  },

  /* 39 */
  {
    _id: '5d0901bb815f01ac870b19a4',
    isTrashed: false,
    isEmailConfirmed: false,
    doForcePasswordChange: false,
    username: 'nope',
    encUserId: '5b1e7ca6a5d2157ef4c91210',
    createdAt: '2018-08-14T18:20:51.382Z',
    updatedAt: '2018-08-14T18:20:51.382Z',
    __v: 0,
  },

  /* 40 */
  {
    _id: '5d0901bb815f01ac870b19a5',
    isTrashed: false,
    isEmailConfirmed: false,
    doForcePasswordChange: false,
    username: 'morganf',
    password: '$2a$12$bJ6SE4Y7KTAt1VtatrwSku2Y.wqto0JQKUjJvkvwGHkoelr2tOKX.',
    encUserId: '5b9149f52ecaf7c30dd47491',
    createdAt: '2018-09-06T15:30:21.278Z',
    updatedAt: '2018-09-06T15:30:21.278Z',
    __v: 0,
  },

  /* 41 */
  {
    _id: '5d0901bb815f01ac870b19a6',
    isTrashed: false,
    isEmailConfirmed: true,
    doForcePasswordChange: false,
    username: 'rick',
    password: '$2a$08$/c9pHIH086E5qc.Mxh04geJ62xygISgF9C7eQnMzsHoukmpZ/QcX.',
    encUserId: '5b245760ac75842be3189525',
    email: 'rick@gmail.com',
    createdAt: '2019-06-18T15:06:41.262Z',
    updatedAt: '2019-06-18T15:06:41.262Z',
    __v: 0,
  },

  /* 42 */
  {
    _id: '5d0901bb815f01ac870b19a7',
    isTrashed: false,
    isEmailConfirmed: true,
    doForcePasswordChange: false,
    username: 'ssmith',
    password: '$2a$12$rAJwBMeVR5RXPhKGGgMRdOM/OaOREMrsIPE2HZcBI0PCW2cME4IFi',
    encUserId: '5b4e4b48808c7eebc9f9e827',
    email: 'ssmith@fakeemail.com',
    createdAt: '2018-09-06T15:30:21.278Z',
    updatedAt: '2018-09-06T15:30:21.278Z',
    __v: 0,
  },

  /* 43 */
  {
    _id: '5d0901bb815f01ac870b19a9',
    isTrashed: false,
    isEmailConfirmed: true,
    doForcePasswordChange: false,
    username: 'pdadmin',
    password: '$2a$12$nQafJwfxx19P2vyBhDLXUeDFNdZU81t1eosZEvs.plyCP1HNSZFtW',
    encUserId: '5b7321ee59a672806ec903d5',
    email: 'pdadmin@test.com',
    createdAt: '2018-08-14T18:20:51.382Z',
    updatedAt: '2018-08-14T18:20:51.382Z',
    __v: 0,
  },

  /* 44 */
  {
    _id: '5d0901bb815f01ac870b19a8',
    isTrashed: false,
    isEmailConfirmed: false,
    doForcePasswordChange: false,
    username: 'sam3',
    password: '$2a$12$BncFqBAu92VeyuKX7WUQjuDREWncoR6BgG0.3aZOulruEs5iwb7qS',
    encUserId: '5b913eaf3add43b868ae9806',
    createdAt: '2018-09-05T20:57:31.730Z',
    updatedAt: '2018-09-05T20:57:31.730Z',
    __v: 0,
  },

  /* 45 */
  {
    _id: '5d0901bb815f01ac870b19ab',
    isTrashed: false,
    isEmailConfirmed: false,
    doForcePasswordChange: false,
    username: 'tracyc',
    password: '$2a$12$svhAmCvhB2Q0iSJlwMyH6.2q4nJKLBvnGAVfXRVqkXDJKotpWd4Wq',
    encUserId: '5b914a102ecaf7c30dd47492',
    createdAt: '2018-09-06T15:30:21.278Z',
    updatedAt: '2018-09-06T15:30:21.278Z',
    __v: 0,
  },

  /* 46 */
  {
    _id: '5d0901bb815f01ac870b19aa',
    isTrashed: false,
    isEmailConfirmed: false,
    doForcePasswordChange: false,
    username: 'drex',
    encUserId: '5b1e7bf9a5d2157ef4c911a6',
    createdAt: '2018-08-12T18:20:51.382Z',
    updatedAt: '2018-08-12T18:20:51.382Z',
    __v: 0,
  },

  /* 47 */
  {
    _id: '5d0901bb815f01ac870b19ac',
    isTrashed: true,
    isEmailConfirmed: false,
    doForcePasswordChange: false,
    username: 'trasheduser',
    encUserId: '5bbe04dbecd6e597fd8fc177',
    createdAt: '2019-06-18T15:06:41.262Z',
    updatedAt: '2019-06-18T15:06:41.262Z',
    __v: 0,
  },

  /* 48 */
  {
    _id: '5d0902414940d3ad1707d1b4',
    isTrashed: false,
    isEmailConfirmed: true,
    doForcePasswordChange: false,
    username: 'jl-picard',
    password: '$2b$12$xI0a6mVLlVoFYeVsmU2XrOVowVVphu9ORSD9EVHG6lzWMvfP8cgES',
    vmtUserId: '5ba289ba7223b9429888b9b4',
    email: '',
    createdAt: '2019-05-23T17:29:21.893Z',
    updatedAt: '2019-05-23T17:29:21.893Z',
    __v: 0,
  },

  /* 49 */
  {
    _id: '5d0902414940d3ad1707d1b5',
    isTrashed: false,
    isEmailConfirmed: true,
    doForcePasswordChange: false,
    username: 'q',
    password: '$2b$12$GMfHvZySEkCTfV0UwRg3EeLFW6ZnonV6UnM7YIhqnNH8ZkjGcU.Ae',
    vmtUserId: '5ba289ba7223b9429888b9ee',
    email: '',
    createdAt: '2019-05-23T17:29:21.894Z',
    updatedAt: '2019-05-23T17:29:21.894Z',
    __v: 0,
  },

  /* 50 */
  {
    _id: '5d0902414940d3ad1707d1b6',
    isTrashed: false,
    isEmailConfirmed: true,
    doForcePasswordChange: false,
    username: 'D-troi',
    password: '$2b$12$PltCtaDCtpD.WakNZ8GUmOfX7kcisuA.PbGLM6HKGAdrkhuIQMzAy',
    vmtUserId: '5be1eba75854270cd0920faa',
    email: 'worf@example.com',
    createdAt: '2019-05-23T17:29:21.894Z',
    updatedAt: '2019-05-23T17:29:21.894Z',
    __v: 0,
  },

  /* 51 */
  {
    _id: '5d0902414940d3ad1707d1b7',
    isTrashed: false,
    isEmailConfirmed: true,
    doForcePasswordChange: false,
    username: 'g-laforge',
    password: '$2b$12$YNI6y1M6u4/Y4mAP.E312OYN./uTIJqKGfUREnhNJ8vs8t/4hbAua',
    vmtUserId: '5bbbbd9a799302265829f5af',
    email: '',
    createdAt: '2019-05-23T17:29:21.893Z',
    updatedAt: '2019-05-23T17:29:21.893Z',
    __v: 0,
  },
  /* 53 */
  {
    _id: '5d0902414940d3ad1707d1b9',
    isTrashed: false,
    isEmailConfirmed: true,
    doForcePasswordChange: false,
    username: 'data',
    password: '$2b$12$Kzr5WEtkOzsCG9LS5fd8G.HVjUk4xp3p/wdzDNB/B5CEWB.oBKEji',
    vmtUserId: '5be1eba75854270cd0920fb8',
    email: 'data@example.com',
    createdAt: '2019-05-23T17:29:21.893Z',
    updatedAt: '2019-05-23T17:29:21.893Z',
    __v: 0,
  },

  /* 54 */
  {
    _id: '5d0902414940d3ad1707d1ba',
    isTrashed: false,
    isEmailConfirmed: true,
    doForcePasswordChange: false,
    username: 'worf',
    password: '$2b$12$jNGkh.0hKAN1BRPUjScjCOE17yO9SkOV6rLdIO6DhAMsHQM28nfJi',
    vmtUserId: '5be1eba75854270cd0920fa9',
    email: 'worf@example.com',
    createdAt: '2019-05-23T17:29:21.893Z',
    updatedAt: '2019-05-23T17:29:21.893Z',
    __v: 0,
  },

  /* 55 */
  {
    _id: '5d0902414940d3ad1707d1bb',
    isTrashed: false,
    isEmailConfirmed: true,
    doForcePasswordChange: false,
    username: 'bcrush',
    password: '$2b$12$Ptcu.r3bhFyE/mrtxAbqO.jGVm7MsoNQLv5XmSC/hXSt.oWPHdXha',
    vmtUserId: '5c531f091748c7196496a556',
    email: 'bcrush@gmail.com',
    createdAt: '2019-05-23T17:29:21.894Z',
    updatedAt: '2019-05-23T17:29:21.894Z',
    __v: 0,
  },
];

var UsersSeeder = Seeder.extend({
  shouldRun: function() {
    console.log('should run');
    return User.count()
      .exec()
      .then(count => count === 0);
  },
  run: function() {
    return User.create(data);
  },
});

module.exports = UsersSeeder;
