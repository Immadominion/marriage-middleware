const mongoose = require('mongoose');

const shareLinkSchema = new mongoose.Schema({
  shareCode: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  firstPartnerAddress: {
    type: String,
    required: true,
    lowercase: true
  },
  firstPartnerName: {
    type: String,
    required: true
  },
  secondPartnerName: {
    type: String,
    required: true
  },
  nftId: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    required: false
  },
  created: {
    type: Date,
    default: Date.now
  },
  claimed: {
    type: Boolean,
    default: false
  },
  secondPartnerAddress: {
    type: String,
    required: false,
    lowercase: true
  },
  claimedDate: {
    type: Date,
    required: false
  },
  location: {
    type: String,
    required: false
  },
  officiant: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('ShareLink', shareLinkSchema);