const Bid = require('../models/Bid');
const Item = require('../models/Item');
const Notification = require('../models/Notification');
const User = require('../models/user');
const { getIo } = require('../socket');


// Retrieve bids for a specific item
exports.getBids = async (req, res) => {
  const { itemId } = req.params;

  try {
    const bids = await Bid.findAll({ where: { item_id: itemId } });

    if (!bids.length) {
      return res.status(404).json({ message: 'No bids found for this item' });
    }

    res.status(200).json({ message: 'Bids retrieved successfully', bids: bids });
  } catch (error) {
    console.error('Error retrieving bids:', error);
    res.status(500).json({ error: 'Failed to retrieve bids', details: error.message });
  }
};


// Place a new bid on an item
exports.placeBid = async (req, res) => {
  const { itemId } = req.params;
  const { bid_amount } = req.body;
  const user_id = req.user.id;

  try {
    const item = await Item.findByPk(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Validate bid amount
    if (parseFloat(bid_amount) <= parseFloat(item.current_price)) {
      return res.status(400).json({ error: 'Bid amount must be higher than current price' });
    }

    const bid = await Bid.create({ item_id: itemId, user_id, bid_amount });

    await item.update({ current_price: bid_amount });

    const io = getIo();
    // Emit WebSocket event to notify clients about the new bid
    io.emit('update', { message: `New bid placed on item ${item.name} with amount ${bid_amount} `});


    const owner = await User.findByPk(item.owner);
    if (owner) {
      await Notification.create({
        user_id: owner.id,
        message: `New bid placed on your item ${item.name} with amount ${bid_amount}`,
      });
      io.emit('notify', { message: `New bid placed on item ${item.name}`, userId: owner.id });
    }

    res.status(201).json(bid);
  } catch (error) {
    console.error('Error placing bid:', error);
    res.status(500).json({ error: 'Failed to place bid' });
  }
};
