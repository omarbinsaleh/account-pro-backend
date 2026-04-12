const mongoose = require('mongoose');

// Define the membershipSchema
const membershipSchema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
   },
   companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company ID is required']
   },
   role: {
      type: String,
      enum: ['owner', 'admin', 'accountant', 'viewer'],
      default: 'viewer'
   }
}, { timestamps: true });

// add a unique index to ensure that a user can only have one membership per company
membershipSchema.index({ userId: 1, companyId: 1 }, { unique: true });

// Define the Membership Model
const Membership = mongoose.model('Membership', membershipSchema);

// Export the Membership model
module.exports = Membership;