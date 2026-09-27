import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';
import env from './config/env.js';
import dns from "dns";

// Setting dns to this specific so that it don't break while connecting to MONGODB
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const PORT = env.PORT || 5000;

const startServer = async () => {
    try {
        // Establish DB connection first
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running in (${env.NODE_ENV}) mode on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();