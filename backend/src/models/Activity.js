const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['DEPLOYMENT', 'EXECUTION', 'VALIDATION', 'APPROVAL', 'ERROR'],
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['PENDING', 'RUNNING', 'SUCCESS', 'FAILED', 'WARNING'],
      default: 'PENDING',
    },
    progress: { type: Number, default: null },
    workflowId: { type: String, default: null },
    workflowName: { type: String, default: null },
    environment: { type: String, enum: ['DEV', 'STAGING', 'PROD', null], default: null },
    userId: { type: String, required: true },
    errorMessage: { type: String, default: null },
  },
  { timestamps: true }
);

activitySchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  obj.timestamp = obj.createdAt?.toISOString();
  delete obj.createdAt;
  delete obj.updatedAt;
  return obj;
};

activitySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);
