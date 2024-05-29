const express = require('express');
const bidController = require('../controllers/bidController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/:itemId/bids', bidController.getBids);
router.post('/:itemId/bids', authMiddleware, bidController.placeBid);

module.exports = router;
