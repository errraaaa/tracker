/* eslint-disable camelcase */
const router = require('express').Router();
const bcrypt = require('bcrypt');
const fetch = require('node-fetch');
const {
  users, groups,
} = require('../db/models');

const client_id = process.env.CLIENT_ID;
const redirect_uri = process.env.REDIRECT_URI;
const client_secret = process.env.CLIENT_SECRET;

const findUser = async (login) => {
  try {
    let user = await users.findOne({
      where: { login },
      include: [{
        model: groups,
        as: 'userStudents',
      },
      {
        model: groups,
        as: 'userTeachers',
      }],
    });
    user = JSON.parse(JSON.stringify(user));
    return user;
  } catch (err) {
    console.log('ERROR--->', err);
  }
  return {};
};

router.route('/')
  .get(async (req, res) => {
    res.json({});
  });

router.route('/login')
  .post(async (req, res) => {
    const { login, pass } = req.body;
    if (login && pass) {
      const user = await findUser(login);
      if (user && await bcrypt.compare(pass, user.pass)) {
        req.session.user = user;
        return res.json(user);
      }
      return res.sendStatus(401);
    }
    return res.sendStatus(401);
  });

router.route('/check')
  .post((req, res) => {
    if (req.session.user) {
      return res.json(req.session.user);
    }
    return res.sendStatus(401);
  });

router.route('/logout')
  .get((req, res) => {
    req.session.destroy();
    res.clearCookie('sid').sendStatus(200);
  });

router.route('/authenticate')
  .post(async (req, res) => {
    const { code } = req.body;

    const string = `?client_id=${client_id}&client_secret=${client_secret}&code=${code}&redirect_uri=${redirect_uri}`;

    try {
      // Request to exchange code for an access token
      let response = await fetch(`https://github.com/login/oauth/access_token/${string}`, {
        method: 'POST',
      });
      response = await response.text();
      const params = new URLSearchParams(response);
      const access_token = params.get('access_token');

      // Request to return data of a user that has been authenticated
      response = await fetch('https://api.github.com/user', { headers: { Authorization: `token ${access_token}` } });
      response = await response.json();

      const user = await findUser(response.login);
      if (user) {
        const { login, name, avatar_url } = response;
        await users.update({ name, avatar_url }, { where: { login } });

        req.session.user = { ...user, name, avatar_url };
        return res.status(200).json(req.session.user);
      }
      return res.sendStatus(401);
    } catch (error) {
      return res.status(400).json(error);
    }
  });

module.exports = router;
