const Sequalize = require("sequelize");
const db = require("../db");
const Joi = require("joi");

const users = db.define("users", {
  name: {
    type: Sequalize.STRING,
    allowNull: false
  },
  email: {
    type: Sequalize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequalize.STRING,
    allowNull: false
  },
  image: {
    type: Sequalize.STRING,
    allowNull: true
  },
  curLat: {
    type: Sequalize.STRING,
    allowNull: false
  },
  curLon: {
    type: Sequalize.STRING,
    allowNull: false
  }
});

function validateUser(user) {
  const schema = {
    name: Joi.string()
      .min(3)
      .max(50)
      .required(),
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(1024)
      .required()
  };
  return Joi.validate(user, schema);
}

module.exports = users; // ------------------- module.exports
exports.validate = validateUser;
