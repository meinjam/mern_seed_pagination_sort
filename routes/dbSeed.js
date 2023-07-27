const express = require('express');
const { seedTask, seedUser } = require('../controller/dbSeedController');

const router = express.Router();

router.get('/user', seedUser);
router.get('/task', seedTask);

module.exports = router;
