const group = require('./Groups');
const users = require('./Users');

//Associations between tables, to link primary keys to foreign keys
users.belongsTo(group);
group.hasMany(users);

module.exports = {
    group,
    users
}