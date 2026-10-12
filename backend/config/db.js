import mongoose from 'mongoose';
import net from 'net';
import { seedInitialData } from '../utils/seed.js';

let memoryServer = null;

const isPortOpen = (host, port, timeout = 1000) => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(timeout);
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.on('error', () => {
      resolve(false);
    });
    socket.connect(port, host);
  });
};

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/food_delivery';

  // Check if target is localhost port 27017
  const isLocalDefault = uri.includes('127.0.0.1:27017') || uri.includes('localhost:27017');

  if (isLocalDefault) {
    const isLocalMongoRunning = await isPortOpen('127.0.0.1', 27017, 1000);
    if (!isLocalMongoRunning) {
      console.log('Local MongoDB service not detected on port 27017.');
      console.log('Starting Embedded In-Memory MongoDB Server...');

      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create({
        instance: { dbName: 'food_delivery' }
      });
      const memoryUri = memoryServer.getUri();
      console.log(`Embedded MongoDB started at: ${memoryUri}`);

      const conn = await mongoose.connect(memoryUri);
      console.log('Connected to In-Memory MongoDB successfully!');
      await seedInitialData();
      return conn;
    }
  }

  // Connect to specified URI (Local or MongoDB Atlas)
  try {
    console.log(`Connecting to MongoDB at: ${uri}...`);
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedInitialData();
    return conn;
  } catch (err) {
    console.warn(`Standard MongoDB connection failed: ${err.message}`);
    console.log('Falling back to In-Memory MongoDB Server...');

    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create({
      instance: { dbName: 'food_delivery' }
    });
    const memoryUri = memoryServer.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log('Connected to In-Memory MongoDB successfully!');
    await seedInitialData();
    return conn;
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};
