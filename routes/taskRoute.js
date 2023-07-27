const express = require('express');
const { getTasks } = require('../controller/taskController');

const router = express.Router();

router.get('/', getTasks);

module.exports = router;
