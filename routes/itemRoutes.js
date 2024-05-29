const express = require('express');
const itemController = require('../controllers/itemController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const upload = require('../utils/upload');

const router = express.Router();

router.get('/', itemController.getItems);
router.get('/:id', itemController.getItem);
router.post('/', authMiddleware, upload.single('image'), itemController.createItem);
router.put('/:id', authMiddleware, roleMiddleware, itemController.updateItem);
router.delete('/:id', authMiddleware, roleMiddleware, itemController.deleteItem);

module.exports = router;
