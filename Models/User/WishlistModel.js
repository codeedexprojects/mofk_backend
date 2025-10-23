const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Products', // This should match the name used in the Product model export
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },{ timestamps: true });
  
  module.exports = mongoose.model('Wishlist', wishlistSchema);
  
