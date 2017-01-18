'use strict';

const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const express = require('express');
const jwt = require('jsonwebtoken');
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/leaderboards', (req, res, next) => {
  knex('games')
    .innerJoin('players', 'players.id', 'games.player_id')
    .innerJoin('levels', 'levels.id', 'games.level_id')
    .orderBy('levels.id')
    .orderBy('games.time')
    .then((rows) => {
      res.send(camelizeKeys(rows));
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
