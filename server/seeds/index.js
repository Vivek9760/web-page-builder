/* ----------------------------- Load Environment ----------------------------- */
require("dotenv").config();

/* ----------------------------- Initialize DB ----------------------------- */
require("../configs/db.config");

const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

/* ----------------------------- Collections to Seed ----------------------------- */
const collections = ["user", "web-page"]; // Add more as needed

const generateUniqueSlug = async (title, slugs) => {
  const baseSlug = title
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-");

  let slug = baseSlug;
  let exists = slugs.has(slug);

  while (exists) {
    const randomSuffix = crypto.randomBytes(2).toString("hex");
    slug = `${baseSlug}-${randomSuffix}`;
    exists = slugs.has(slug);
  }

  return slug;
};

(async () => {
  try {
    console.log("\n🌱 Seeding Start...\n");

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
      let data = require(seedPath);

      await Model.deleteMany({});

      if (name == "web-page") {
        const modelPath = path.resolve(__dirname, `../models/user.model.js`);
        const UserModel = require(modelPath);
        const users = await UserModel.find({});
        let newData = [];
        let slugs = new Set();

        for (const user of users) {
          for (const i of data) {
            const template = JSON.parse(JSON.stringify(i));
            template.author = user._id;
            template.slug = await generateUniqueSlug(template.title, slugs);
            slugs.add(template.slug);
            newData.push(template);
          }
        }
        data = newData;
      }
      const result = await Model.insertMany(data);

      console.log(`✅ Inserted ${result.length} record(s) into "${name}"\n`);
    }

    console.log("✅ Seeding Completed!\n");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error during seeding:", err.message);
    process.exit(1);
  }
})();
