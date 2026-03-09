const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info',
    },
    message: { type: String, required: true },
    title: { type: String, default: '' },
    read: { type: Boolean, default: false },
    actionUrl: { type: String, default: null },
  },
  { timestamps: true }
);

notificationSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  obj.timestamp = obj.createdAt?.toISOString();
  delete obj.createdAt;
  delete obj.updatedAt;
  return obj;
};

notificationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
