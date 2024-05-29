const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  const user_id = req.user.id;

  try {
    const notifications = await Notification.findAll({ where: { user_id } });
    res.json(notifications);
  } catch (error) {
    res.status(400).json({ error: 'Failed to retrieve notifications' });
  }
};

exports.markRead = async (req, res) => {
  const { ids } = req.body;

  try {
    await Notification.update({ is_read: true }, { where: { id: ids } });
    const updatedNotifications = await Notification.findAll({ where: { id: ids } });
    res.status(200).json({ notifications: updatedNotifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to mark notifications as read' });
  }
};

