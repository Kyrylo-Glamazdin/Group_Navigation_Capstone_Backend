const Sequalize = require('sequelize');
const db = require('../db');

const group = db.define("groups", {
    name:{
        type: Sequalize.STRING,
        allowNull: false
    },
    users:{
        type: Sequalize.STRING,
        allowNull: false
    },
    latitude:{
        type: Sequalize.STRING,
        allowNull: false
    },
    longitude:{
        type: Sequalize.STRING,
        allowNull: false
    }
});

module.exports = group;