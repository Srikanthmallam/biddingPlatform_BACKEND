const Item = require('../models/Item');
const { Op } = require('sequelize');


//get all items 
exports.getItems = async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const offset = (page - 1) * limit;

  try {
    const items = await Item.findAndCountAll({
      where: {
        name: { [Op.like]: `%${search}%` },
      },
      limit,
      offset,
    });
    res.json(items);
  } catch (error) {
    res.status(400).json({ error: 'Failed to retrieve items' });
  }
};

//get specific item by id
exports.getItem = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: 'Failed to retrieve item' });
  }
};


//create item
exports.createItem = async (req, res) => {
  const { name, description, starting_price, end_time } = req.body;
  const image_url = req.file ? req.file.path : null;
  const user_id = req.user.id;

  try {
    const item = await Item.create({ name, description, starting_price, current_price: starting_price, image_url, end_time,owner:user_id });
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create item' });
  }
};

//update item
exports.updateItem = async (req, res) => {
  const { id } = req.params;
  const { name, description, starting_price, end_time } = req.body;

  console.log(req.body);

  try {
    const item = await Item.findByPk(id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    await item.update({ name, description, starting_price, end_time });
    res.json(item);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Failed to update item' });
  }
};

exports.deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Item.findByPk(id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    await item.destroy();
    res.status(200).json({ message: 'Item successfully deleted'});
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete item' });
  }
};

