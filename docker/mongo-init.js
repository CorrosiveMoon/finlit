// MongoDB initialization script
// Creates application user with limited permissions

db = db.getSiblingDB('financial-literacy');

// Create application user with read/write permissions only on this database
db.createUser({
  user: process.env.MONGO_APP_USER || 'app_user',
  pwd: process.env.MONGO_APP_PASSWORD || 'change_this_app_password_456!',
  roles: [
    {
      role: 'readWrite',
      db: 'financial-literacy'
    }
  ]
});

// Create indexes for better performance
db.budgets.createIndex({ userId: 1 });
db.budgets.createIndex({ year: 1 });
db.budgets.createIndex({ userId: 1, year: 1 });

db.templates.createIndex({ userId: 1 });

print('✅ MongoDB initialized with application user and indexes');
