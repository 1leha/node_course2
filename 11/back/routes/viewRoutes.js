const express = require('express');

const viewController = require('../controllers/viewController');

const router = express.Router();

router.get('/', viewController.home);
router.get('/todos', viewController.todos);

module.exports = router;
