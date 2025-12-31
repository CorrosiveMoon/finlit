const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://yaseen2003_db_user:5sxsNGarsvCoqxZW@cluster0.wg1odoq.mongodb.net/financial_literacy?retryWrites=true&w=majority&appName=Cluster0";

async function testConnection() {
  const client = new MongoClient(uri);
  
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await client.connect();
    console.log('✅ Connected successfully!');
    
    // Test database access
    const db = client.db('financial_literacy');
    console.log('✅ Accessing database: financial_literacy');
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log('📁 Collections found:', collections.length);
    collections.forEach(col => {
      console.log('  -', col.name);
    });
    
    // Try to query monthlybudgets
    const budgets = db.collection('monthlybudgets');
    const count = await budgets.countDocuments();
    console.log(`📊 monthlybudgets collection has ${count} documents`);
    
    // Try to query budgettemplates
    const templates = db.collection('budgettemplates');
    const templateCount = await templates.countDocuments();
    console.log(`📊 budgettemplates collection has ${templateCount} documents`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  } finally {
    await client.close();
    console.log('🔌 Connection closed');
  }
}

testConnection();
