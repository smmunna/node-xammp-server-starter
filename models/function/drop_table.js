// dropTable.js
const connection = require('../db/db');

// Function to drop a table
function dropTable(tableName) {
    // Check if the table exists
    connection.query(`SHOW TABLES LIKE '${tableName}'`, (err, results) => {
        if (err) throw err;
        if (results.length === 1) {
            // Table exists, drop it
            connection.query(`DROP TABLE ${tableName}`, (err, results) => {
                if (err) throw err;
                console.log(`Table '${tableName}' dropped successfully`);
                connection.end(); // Close the connection
            });
        } else {
            console.log(`Table '${tableName}' does not exist`);
            connection.end(); // Close the connection since we're done
        }
    });
}

module.exports = dropTable;
