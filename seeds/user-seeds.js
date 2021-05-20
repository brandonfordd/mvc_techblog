const { User } = require('../models');

const userData = [
  {
    username: "Audrey",
    email: "audrey@gmail.com",
    password: "password1234"
  },
  {
    username: "Ashley",
    email: "ashley@gmail.com",
    password: "password1234"
  },
  {
    username: "Susie",
    email: "susie@gmail.com",
    password: "password1234"
  },
  {
    username: "Roger",
    email: "roger@gmail.com",
    password: "password1234"
  },
  {
    username: "Coblie",
    email: "colbie@gmail.com",
    password: "password1234"
  }
];

const seedUsers = () => User.bulkCreate(userData);

//  password must be hashed in update route

module.exports = seedUsers;