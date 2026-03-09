const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('./config');
const User = require('./models/User');
const Workflow = require('./models/Workflow');
const AuditLog = require('./models/AuditLog');
const Notification = require('./models/Notification');
const Activity = require('./models/Activity');

const seedUsers = [
  {
    email: config.adminEmail,
    password: config.adminPassword,
    name: config.adminName,
    role: 'ADMIN',
  },
];

const createSteps = () => [
  {
    id: 'step-1',
    type: 'INPUT',
    name: 'User Input',
    description: 'Collect user query and context',
    order: 0,
    config: {
      fields: [
        { name: 'query', type: 'text', required: true },
        { name: 'context', type: 'text', required: false },
      ],
    },
  },
  {
    id: 'step-2',
    type: 'MODEL',
    name: 'GPT-4 Processing',
    description: 'Process input with GPT-4',
    order: 1,
    config: {
      modelId: 'gpt-4',
      modelName: 'GPT-4',
      parameters: { model: 'gpt-4' },
      temperature: 0.7,
      maxTokens: 2000,
    },
  },
  {
    id: 'step-3',
    type: 'VALIDATION',
    name: 'Output Validation',
    description: 'Validate model output',
    order: 2,
    config: {
      rules: [
        { field: 'response', condition: 'required', message: 'Response is required' },
        { field: 'response', condition: 'min', value: 10, message: 'Response must be at least 10 characters' },
      ],
    },
  },
  {
    id: 'step-4',
    type: 'OUTPUT',
    name: 'Format Response',
    description: 'Format and return response',
    order: 3,
    config: { format: 'json', destination: 'api/response' },
  },
];

async function seed() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Workflow.deleteMany({}),
      AuditLog.deleteMany({}),
      Notification.deleteMany({}),
      Activity.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    // Create users (use save() to trigger pre-save password hashing hook)
    const users = [];
    for (const userData of seedUsers) {
      const user = new User(userData);
      await user.save();
      users.push(user);
    }
    const adminUser = users.find((u) => u.role === 'ADMIN');
    console.log(`Created ${users.length} users`);

    // Create workflows
    const workflows = await Workflow.insertMany([
      {
        name: 'Customer Support AI',
        description: 'AI workflow for handling customer support queries with GPT-4',
        status: 'PUBLISHED',
        steps: createSteps(),
        currentVersion: 3,
        versions: [
          {
            id: 'v-1', version: 1, createdAt: new Date('2024-01-15T10:00:00Z'),
            createdBy: 'Admin User', changes: 'Initial version', steps: createSteps(),
          },
          {
            id: 'v-2', version: 2, createdAt: new Date('2024-01-20T14:30:00Z'),
            createdBy: 'John Engineer', changes: 'Updated model parameters', steps: createSteps(),
          },
          {
            id: 'v-3', version: 3, createdAt: new Date('2024-01-21T09:15:00Z'),
            createdBy: 'Admin User', changes: 'Added validation step', steps: createSteps(),
          },
        ],
        environments: [
          { environment: 'DEV', version: 3, deployedAt: new Date('2024-01-21T09:20:00Z'), deployedBy: 'Admin User', status: 'active' },
          { environment: 'STAGING', version: 2, deployedAt: new Date('2024-01-20T15:00:00Z'), deployedBy: 'Admin User', status: 'active' },
          { environment: 'PROD', version: 2, deployedAt: new Date('2024-01-20T16:00:00Z'), deployedBy: 'Admin User', status: 'active' },
        ],
        createdBy: 'Admin User',
        updatedBy: 'Admin User',
        tags: ['customer-support', 'gpt-4', 'production'],
      },
      {
        name: 'Content Generation Pipeline',
        description: 'Automated content generation workflow for marketing materials',
        status: 'DRAFT',
        steps: [
          {
            id: 'step-1', type: 'INPUT', name: 'Content Brief', order: 0,
            config: {
              fields: [
                { name: 'topic', type: 'text', required: true },
                { name: 'tone', type: 'text', required: true },
                { name: 'length', type: 'number', required: true },
              ],
            },
          },
          {
            id: 'step-2', type: 'MODEL', name: 'Claude 3 Generation', order: 1,
            config: { modelId: 'claude-3', modelName: 'Claude 3 Opus', parameters: {}, temperature: 0.8, maxTokens: 4000 },
          },
        ],
        currentVersion: 1,
        versions: [],
        environments: [],
        createdBy: 'John Engineer',
        updatedBy: 'John Engineer',
        tags: ['content', 'marketing', 'draft'],
      },
      {
        name: 'Data Analysis Workflow',
        description: 'AI-powered data analysis and insights generation',
        status: 'PENDING_APPROVAL',
        steps: createSteps(),
        currentVersion: 1,
        versions: [],
        environments: [
          { environment: 'DEV', version: 1, deployedAt: new Date('2024-01-20T10:00:00Z'), deployedBy: 'John Engineer', status: 'active' },
        ],
        createdBy: 'John Engineer',
        updatedBy: 'John Engineer',
        tags: ['analytics', 'data'],
      },
    ]);
    console.log(`Created ${workflows.length} workflows`);

    // Create audit logs
    const auditLogs = await AuditLog.insertMany([
      {
        workflowId: workflows[0]._id.toString(),
        workflowName: 'Customer Support AI',
        action: 'published',
        userId: adminUser._id.toString(),
        userName: 'Admin User',
        details: 'Published version 3 to DEV environment',
      },
      {
        workflowId: workflows[0]._id.toString(),
        workflowName: 'Customer Support AI',
        action: 'updated',
        userId: adminUser._id.toString(),
        userName: adminUser.name,
        details: 'Added validation step',
      },
      {
        workflowId: workflows[1]._id.toString(),
        workflowName: 'Content Generation Pipeline',
        action: 'created',
        userId: adminUser._id.toString(),
        userName: adminUser.name,
        details: 'Created new workflow',
      },
      {
        workflowId: workflows[0]._id.toString(),
        workflowName: 'Customer Support AI',
        action: 'published',
        userId: adminUser._id.toString(),
        userName: 'Admin User',
        details: 'Published version 2 to PROD environment',
      },
    ]);
    console.log(`Created ${auditLogs.length} audit logs`);

    // Create sample notifications for each user
    const notificationData = [];
    for (const user of users) {
      notificationData.push(
        {
          userId: user._id.toString(),
          type: 'info',
          title: 'Welcome to FlowForge AI',
          message: 'Your account has been set up. Start by exploring workflows.',
          read: false,
        },
        {
          userId: user._id.toString(),
          type: 'success',
          title: 'Workflow Published',
          message: 'Customer Support AI has been published to DEV.',
          read: false,
        }
      );
    }
    await Notification.insertMany(notificationData);
    console.log(`Created ${notificationData.length} notifications`);

    // Create sample activity
    const activities = await Activity.insertMany([
      {
        type: 'DEPLOYMENT',
        title: 'Deployed Customer Support AI',
        description: 'Version 3 deployed to DEV environment',
        status: 'SUCCESS',
        progress: 100,
        workflowId: workflows[0]._id.toString(),
        workflowName: 'Customer Support AI',
        environment: 'DEV',
        userId: adminUser._id.toString(),
      },
      {
        type: 'EXECUTION',
        title: 'Content Pipeline Test Run',
        description: 'Test execution of Content Generation Pipeline',
        status: 'RUNNING',
        progress: 45,
        workflowId: workflows[1]._id.toString(),
        workflowName: 'Content Generation Pipeline',
        environment: 'DEV',
        userId: adminUser._id.toString(),
      },
      {
        type: 'APPROVAL',
        title: 'Data Analysis Review',
        description: 'Pending approval for Data Analysis Workflow',
        status: 'PENDING',
        progress: 0,
        workflowId: workflows[2]._id.toString(),
        workflowName: 'Data Analysis Workflow',
        userId: adminUser._id.toString(),
      },
    ]);
    console.log(`Created ${activities.length} activities`);

    console.log('\nSeed completed successfully!');
    console.log(`\nAdmin account: ${config.adminEmail} / ${config.adminPassword}`);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
