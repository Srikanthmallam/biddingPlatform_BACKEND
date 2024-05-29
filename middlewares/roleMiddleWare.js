const Item = require('../models/Item');

const roleMiddleware = async (req, res, next) => {
  try {
    const { user } = req;

    if (!user) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Admins can proceed
    if (user.role === 'admin') {
      return next();
    }

    // Check if user is the owner of the item
    if (user.role === 'user') {
      const itemId = req.params.id;
      const item = await Item.findByPk(itemId);

      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }

      if (item.owner === user.id) {
        return next();
      } else {
        const action = req.method === 'DELETE' ? 'delete' : 'modify';
        return res.status(403).json({ error: `You do not have permission to ${action} this item` });
      }
    }

    // If the role is neither admin nor user (which shouldn't happen), return forbidden
    return res.status(403).json({ error: 'Forbidden' });
  } catch (error) {
    console.error('Role Middleware Error:', error);
    return res.status(500).json({ error: 'An error occurred while checking permissions' });
  }
};

module.exports = roleMiddleware;
