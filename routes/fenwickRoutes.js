const express = require('express');
const router = express.Router();
const { updateValue, getPrefixSum, getAllValues, getDbPrefixSum, rebuildTree } = require('../controllers/fenwickController');

router.post('/update', updateValue);

router.get('/prefix-sum/:index', getPrefixSum);

router.get('/prefix-db/:index', getDbPrefixSum);

router.post('/rebuild', rebuildTree);

router.get('/all', getAllValues);

module.exports = router;
