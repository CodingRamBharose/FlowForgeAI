const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    workflowId: { type: String, required: true },
    workflowName: { type: String, required: true },
    action: {
      type: String,
      enum: ['created', 'updated', 'published', 'approved', 'rejected', 'rollback', 'deleted'],
      required: true,
    },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    details: { type: String, default: '' },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

auditLogSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  obj.timestamp = obj.createdAt?.toISOString();
  delete obj.createdAt;
  delete obj.updatedAt;
  return obj;
};

auditLogSchema.index({ workflowId: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
