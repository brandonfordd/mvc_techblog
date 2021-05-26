// Import User seed data
const userData = require('./userData.json');
const commentData = require('./commentData.json');
const postData = require('./postData.json');

//connection to db
const sequelize = require('../config/connection');

// Import User model
const { User, Comment, Post } = require('../models');

//async function to wait and see all
const seedAll = async () => {
   // Drop existing tables
  await sequelize.sync({ force: true });
  console.log('\n----- DATABASE SYNCED -----\n');
  // Create user seed data
  await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });
  console.log('\n----- Users SEEDED -----\n');
  // Create patient seed data
  await Post.bulkCreate(postData, {
    individualHooks: true,
    returning: true,
  });
  console.log('\n----- Posts SEEDED -----\n');
  // Create record seed data
  await Comment.bulkCreate(commentData, {
    individualHooks: true,
    returning: true,
  });
  console.log('\n----- Comments SEEDED -----\n');

  process.exit(0);
};

//run seeding all function
seedAll();

