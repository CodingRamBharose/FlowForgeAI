const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['text', 'number', 'boolean', 'file'], required: true },
    required: { type: Boolean, default: false },
    defaultValue: { type: mongoose.Schema.Types.Mixed },
  },
  { _id: false }
);

const ruleSchema = new mongoose.Schema(
  {
    field: { type: String, required: true },
    condition: { type: String, enum: ['required', 'min', 'max', 'pattern'], required: true },
    value: { type: mongoose.Schema.Types.Mixed },
    message: { type: String, required: true },
  },
  { _id: false }
);

const stepSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: { type: String, enum: ['INPUT', 'MODEL', 'VALIDATION', 'OUTPUT'], required: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    order: { type: Number, required: true },
    config: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { _id: false }
);

const versionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    version: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: String, required: true },
    changes: { type: String, default: '' },
    steps: [stepSchema],
  },
  { _id: false }
);

const environmentDeploymentSchema = new mongoose.Schema(
  {
    environment: { type: String, enum: ['DEV', 'STAGING', 'PROD'], required: true },
    version: { type: Number, required: true },
    deployedAt: { type: Date, default: Date.now },
    deployedBy: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { _id: false }
);

const workflowSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'PUBLISHED', 'ARCHIVED'],
      default: 'DRAFT',
    },
    steps: [stepSchema],
    currentVersion: { type: Number, default: 1 },
    versions: [versionSchema],
    environments: [environmentDeploymentSchema],
    createdBy: { type: String, required: true },
    updatedBy: { type: String, required: true },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

workflowSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  obj.createdAt = obj.createdAt?.toISOString();
  obj.updatedAt = obj.updatedAt?.toISOString();
  // Convert dates in versions and environments
  if (obj.versions) {
    obj.versions = obj.versions.map((v) => ({
      ...v,
      createdAt: v.createdAt instanceof Date ? v.createdAt.toISOString() : v.createdAt,
    }));
  }
  if (obj.environments) {
    obj.environments = obj.environments.map((e) => ({
      ...e,
      deployedAt: e.deployedAt instanceof Date ? e.deployedAt.toISOString() : e.deployedAt,
    }));
  }
  return obj;
};

// Text index for search
workflowSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Workflow', workflowSchema);
