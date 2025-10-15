/* ----------------------------- Load Environment ----------------------------- */
require('dotenv').config();

/* ----------------------------- Initialize DB ----------------------------- */
require('../configs/db.config');

const path = require('path');
const fs = require('fs');

/* ----------------------------- Collections to Seed ----------------------------- */
const collections = ['user']; // Add more as needed

(async () => {
    try {
        console.log('\n🌱 Seeding Start...\n');

        for (const name of collections) {
            console.log(`🔄 Seeding collection: ${name}`);

            // Dynamically load model
            const modelPath = path.resolve(__dirname, `../models/${name}.model.js`);
            const Model = require(modelPath);

            // Load seed data
            const seedPath = path.resolve(__dirname, `./${name}.seed.json`);
            if (!fs.existsSync(seedPath)) {
                console.warn(`⚠️  Skipped: No seed file for "${name}"`);
                continue;
            }
            const data = require(seedPath);

            // Seed DB
            await Model.deleteMany({});
            const result = await Model.insertMany(data);

            console.log(`✅ Inserted ${result.length} record(s) into "${name}"\n`);
        }

        console.log('✅ Seeding Completed!\n');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error during seeding:', err.message);
        process.exit(1);
    }
})();
