const { connect, Model, JsonDB } = require('synz-db');

const db = connect('./data');

console.log('Database connected to: ./data');

module.exports = { connected: true, db };