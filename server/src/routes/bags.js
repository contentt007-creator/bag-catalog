const express = require('express');
const Bag = require('../models/Bag');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    const bags = await Bag.find(filter).sort({ createdAt: -1 });
    res.json(bags);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bags' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const bag = new Bag(req.body);
    await bag.save();
    res.status(201).json(bag);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const bag = await Bag.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!bag) return res.status(404).json({ error: 'Bag not found' });
    res.json(bag);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const bag = await Bag.findByIdAndDelete(req.params.id);
    if (!bag) return res.status(404).json({ error: 'Bag not found' });
    res.json({ message: 'Bag deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete bag' });
  }
});

module.exports = router;
