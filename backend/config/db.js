const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campusride';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`=================================================`);
    console.log(`[MongoDB Atlas] Connected Successfully!`);
    console.log(`[MongoDB Atlas] Host: ${conn.connection.host}`);
    console.log(`[MongoDB Atlas] Database Name: ${conn.connection.name}`);
    console.log(`=================================================`);
  } catch (error) {
    console.warn(`[MongoDB Atlas Warning] ${error.message}`);
    console.log(`[MongoDB Atlas Tip] To allow direct Atlas access from anywhere, add 0.0.0.0/0 in MongoDB Atlas -> Network Access.`);
    
    // Fallback to in-memory database engine for seamless dynamic testing
    try {
      console.log(`[MongoDB Engine] Initializing In-Memory Dynamic Database...`);
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memoryConn = await mongoose.connect(mongod.getUri());
      console.log(`=================================================`);
      console.log(`[MongoDB Engine] Dynamic Database Online: ${memoryConn.connection.host}`);
      console.log(`=================================================`);
    } catch (memErr) {
      console.error(`[MongoDB Fallback Error]: ${memErr.message}`);
    }
  }
};

module.exports = connectDB;
