const mongoose = require('mongoose');

const dbURL = `${process.env.DB_URL}${process.env.DB_NAME}`;

(async () => {
    try {
        await mongoose.connect(dbURL);
        console.log('✅ Database connected successfully');
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
    }
})();