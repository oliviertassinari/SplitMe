// @flow weak
/* eslint-disable no-console */

import { Router as routerCreator } from 'express';
import FB from 'fb';
import nano from 'nano';
import moment from 'moment';
import bodyParser from 'body-parser';
import messages from 'server/messages';
import config from 'config';

let cookie;
let couchDB = nano({
  url: config.couchUrl,
});

function getCouchUserId(email) {
  return `org.couchdb.user:${email}`;
}

function signin(email, facebook) {
  return new Promise((resolve, reject) => {
    // Weak password generator, good for now
    const password = Math.random().toString(36).substr(2, 8);

    const user = {
      _id: getCouchUserId(email),
      name: email,
      password,
      facebookName: facebook ? facebook.name : null,
      facebookId: facebook ? facebook.id : null,
      type: 'user',
      roles: [],
    };

    couchDB.use('_users').insert(user, (error2) => {
      if (error2) {
        reject(error2);
        return;
      }

      resolve(user);
    });
  });
}

function getResponse(status, body, context) {
  return {
    status,
    body,
    context,
  };
}

function sanetizeCouchDBName(string) {
  let output = '';

  for (let i = 0; i < string.length; i += 1) {
    let char = string[i];

    if (/^[0-9-a-z}]/.test(char) === false) {
      char = '/';
    }

    output += char;
  }

  return output;
}

function setUserWithRoles(email, roles) {
  return new Promise((resolve, reject) => {
    couchDB.use('_users').get(getCouchUserId(email), (error, user) => {
      if (error) {
        reject(error);
      } else {
        user.roles = user.roles.concat(roles);

        couchDB.use('_users').insert(user, (error2) => {
          if (error2) {
            reject(error2);
            return;
          }

          resolve();
        });
      }
    });
  });
}

couchDB.auth(config.couchUsername, config.couchPassword, (error, body, headers) => {
  if (error) {
    console.log(error);
    return;
  }

  // change the cookie if couchDB tells us to
  if (headers && headers['set-cookie']) {
    cookie = headers['set-cookie'];
  }

  couchDB = nano({
    url: config.couchUrl,
    cookie,
  });

  console.log(`Connected to couchDB : ${config.couchUrl} ✅`);
});

const apiRouter = routerCreator();

apiRouter.use(bodyParser.json()); // for parsing application/json

apiRouter.use((req, res, next) => {
  if (!req.body.accessToken) {
    res.send(getResponse('error', messages.ACCESSTOKEN_MISSING, 'facebook'));
    return;
  }

  FB.setAccessToken(req.body.accessToken);
  FB.api('me', {
    fields: [
      'id',
      'name',
      'email',
    ],
  }, (response) => {
    if (response.error) {
      res.send(getResponse('error', response.error, 'facebook'));
      return;
    }

    req.facebook = response;
    next();
  });

  // req.facebook = {
  //   id: 1339274745,
  //   name: 'Olivier Tassinari',
  //   email: 'olivier.tassinari@gmail.com',
  // };
  // next();
});

apiRouter.post('/login', (req, res) => {
  const email = req.facebook.email;
  const facebook = req.facebook;

  new Promise((resolve, reject) => {
    couchDB.use('_users').get(getCouchUserId(email), (error) => {
      if (error) {
        if (error.error === 'not_found') {
          signin(email, facebook).then(() => {
            resolve({
              state: messages.SIGNEDIN,
            });
          }).catch((error2) => {
            reject(error2);
          });
        } else {
          reject(error);
        }
      } else {
        resolve({
          state: messages.LOGGEDIN,
        });
      }
    });
  })
    .then((response) => {
      res.send(getResponse('success', response, 'couchDB'));
    })
    .catch((error) => {
      res.send(getResponse('error', error, 'couchDB'));
    });
});

apiRouter.get('/account/create', (req, res) => {
  const databaseName = `account_${
    sanetizeCouchDBName(req.facebook.email)}_1_${
    moment().valueOf().toString()}`;

  couchDB.db.create(databaseName, (error) => {
    if (error) {
      res.send(getResponse('error', error, 'couchDB'));
      return;
    }

    couchDB.use(databaseName).insert({
      members: {
        names: [],
        roles: [databaseName],
      },
      admins: {
        names: [],
        roles: [],
      },
    }, '_security', (error2) => {
      if (error2) {
        res.send(getResponse('error', error2, 'couchDB'));
        return;
      }

      setUserWithRoles(req.facebook.email, [databaseName])
        .then(() => {
          res.send(getResponse('success', {
            accountDatabaseName: databaseName,
          }, 'couchDB'));
        }).catch((error3) => {
          res.send(getResponse('error', error3, 'couchDB'));
        });
    });
  });
});

apiRouter.get('/account/set_right', (req, res) => {
  const members = JSON.parse(req.query.members);
  const accountDatabaseName = req.query.accountDatabaseName;

  couchDB.use('_users').get(getCouchUserId(req.facebook.email), (error, body) => {
    if (error) {
      res.send(getResponse('error', error, 'couchDB'));
      return;
    }

    if (body.roles.indexOf(accountDatabaseName) === -1) {
      res.send(getResponse('error', 'You are not allowed to edit this account', 'auth'));
      return;
    }

    const promises = members.map((member) => (
      setUserWithRoles(member, [accountDatabaseName])
    ));

    Promise.all(promises)
      .then((response) => {
        res.send(getResponse('success', response, 'couchDB'));
      }).catch((error2) => {
        res.send(getResponse('error', error2, 'couchDB'));
      });
  });
});

apiRouter.get('*', (req, res) => {
  res.send(getResponse('error'));
});

export default apiRouter;
