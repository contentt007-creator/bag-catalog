const mongoose = require('mongoose');

const bagSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  imageUrl: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['Tote', 'Clutch', 'Backpack', 'Sling', 'Shoulder', 'Other'],
  },
  inStock: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Bag', bagSchema);
