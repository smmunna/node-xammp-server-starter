// app.js
const createTable = require('./function/create_table');
const dropTable = require('./function/drop_table');
const {usersSchema}= require('./schema/userSchema');

// Drop table if it exists
// dropTable('users')


// Call the function to create a table
createTable('users', usersSchema);