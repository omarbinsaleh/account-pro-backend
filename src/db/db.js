const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_ATLAS_URI || process.env.MONGODB_LOCAL_URI;

/**
 * Function to connect to the MongoDB database with retry logic and automatic reconnection on disconnection.
 * It attempts to connect to the database and logs the status. If the connection fails, it retries every 5 seconds.
 * Additionally, it listens for disconnection events and attempts to reconnect automatically.
 * @return {Promise<void>} A promise that resolves when the connection is successful or rejects if there is an error.
 * @throws {Error} Throws an error if there is an issue connecting to the database.
 * @example
 * connectToDatabase()
 *   .then(() => console.log('Database connection established'))
 *   .catch((error) => console.error('Failed to connect to database:', error));
 * 
 * Note: Ensure that the environment variables MONGODB_ATLAS_URI or MONGODB_LOCAL_URI are set correctly before calling this function.
 */
const connectToDatabase = async () => {
   try {
      await mongoose.connect(mongoURI);
      console.log('Connected to DB successfully');
   } catch (error) {
      console.error('Error connecting to DB:', error);
      console.log('Retrying to connect to DB in 5 seconds...');
      setTimeout(connectToDatabase, 5000);
   } finally {
      mongoose.connection.on('disconnected', () => {
         console.log('DB Connection Lost. Attempting to reconnect...');
         connectToDatabase();
      });
   };
};

// export th connectToDatabase function
module.exports = connectToDatabase;