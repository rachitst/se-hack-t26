const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// In-memory settings store (replace with database in production)
let settings = {
  notificationThreshold: 10,
  autoReorder: true,
  emailNotifications: true,
  defaultWarehouse: null,
  theme: 'light',
  language: 'en',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  currency: 'USD'
};

// Get all settings
router.get('/', (req, res) => {
  res.json(settings);
});

// Update settings
router.put('/', [
  body('notificationThreshold').optional().isInt({ min: 0 }),
  body('autoReorder').optional().isBoolean(),
  body('emailNotifications').optional().isBoolean(),
  body('theme').optional().isIn(['light', 'dark']),
  body('language').optional().isIn(['en', 'es', 'fr']),
  body('dateFormat').optional().isIn(['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']),
  body('timeFormat').optional().isIn(['12h', '24h']),
  body('currency').optional().isIn(['USD', 'EUR', 'GBP'])
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  settings = { ...settings, ...req.body };
  res.json(settings);
});

// Get specific setting
router.get('/:key', (req, res) => {
  const { key } = req.params;
  if (settings[key] === undefined) {
    return res.status(404).json({ message: 'Setting not found' });
  }
  res.json({ [key]: settings[key] });
});

// Update specific setting
router.put('/:key', [
  body('value').notEmpty()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { key } = req.params;
  const { value } = req.body;

  if (settings[key] === undefined) {
    return res.status(404).json({ message: 'Setting not found' });
  }

  // Validate setting value based on key
  switch (key) {
    case 'notificationThreshold':
      if (typeof value !== 'number' || value < 0) {
        return res.status(400).json({ message: 'Invalid notification threshold' });
      }
      break;
    case 'autoReorder':
    case 'emailNotifications':
      if (typeof value !== 'boolean') {
        return res.status(400).json({ message: 'Invalid boolean value' });
      }
      break;
    case 'theme':
      if (!['light', 'dark'].includes(value)) {
        return res.status(400).json({ message: 'Invalid theme' });
      }
      break;
    case 'language':
      if (!['en', 'es', 'fr'].includes(value)) {
        return res.status(400).json({ message: 'Invalid language' });
      }
      break;
    case 'dateFormat':
      if (!['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'].includes(value)) {
        return res.status(400).json({ message: 'Invalid date format' });
      }
      break;
    case 'timeFormat':
      if (!['12h', '24h'].includes(value)) {
        return res.status(400).json({ message: 'Invalid time format' });
      }
      break;
    case 'currency':
      if (!['USD', 'EUR', 'GBP'].includes(value)) {
        return res.status(400).json({ message: 'Invalid currency' });
      }
      break;
  }

  settings[key] = value;
  res.json({ [key]: value });
});

module.exports = router; 