import 'dotenv/config.js';
import { connectToDb } from './src/config/database.js';
import app from './src/app.js';

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || '';

function startServer() {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

if (!MONGO_URI) {
  console.warn('MONGO_URI is empty. Skipping database connection.');
  startServer();
} else {
  connectToDb(MONGO_URI)
    .then(() => startServer())
    .catch((err) => {
      console.error('Failed to connect to MongoDB:', err);
      process.exit(1);
    });
}
