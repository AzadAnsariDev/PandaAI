import 'dotenv/config.js';
import { connectToDb } from './src/config/database.js';
import app from './src/app.js';
import {createServer} from 'http';
import { initServer } from '../backend/src/sockets/server.socket.js';

const PORT = process.env.PORT || 3000;
connectToDb()

const httpServer = createServer(app)

initServer(httpServer)


httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});