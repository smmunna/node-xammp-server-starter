// createTable.js
const connection = require('../db/db');

// Function to create or alter a table
function createTable(tableName, schema) {
    // Check if the table exists
    connection.query(`SHOW TABLES LIKE '${tableName}'`, (err, results) => {
        if (err) throw err;
        if (results.length === 1) {
            console.log(`Table '${tableName}' already exists`);
            // Table exists, so check if all columns are present
            connection.query(`DESCRIBE ${tableName}`, (err, existingColumns) => {
                if (err) throw err;
                const existingColumnNames = existingColumns.map(column => column.Field);
                const newColumns = Object.entries(schema).filter(([columnName]) => !existingColumnNames.includes(columnName));
                const droppedColumns = existingColumnNames.filter(columnName => !Object.keys(schema).includes(columnName));
                if (newColumns.length === 0 && droppedColumns.length === 0) {
                    console.log(`Table '${tableName}' is up to date`);
                    connection.end(); // Close the connection since we're done
                } else {
                    const queries = [];
                    if (newColumns.length > 0) {
                        // Add new columns
                        const alterTableQuery = `ALTER TABLE ${tableName} ADD (${newColumns.map(([columnName, columnDefinition]) => `${columnName} ${columnDefinition}`).join(', ')})`;
                        queries.push(alterTableQuery);
                    }
                    if (droppedColumns.length > 0) {
                        // Drop columns
                        droppedColumns.forEach(columnName => {
                            const dropColumnQuery = `ALTER TABLE ${tableName} DROP COLUMN ${columnName}`;
                            queries.push(dropColumnQuery);
                        });
                    }
                    // Execute all queries
                    executeQueries(queries);
                }
            });
        } else {
            // Table does not exist, so create it
            const columns = Object.entries(schema).map(([columnName, columnDefinition]) => `${columnName} ${columnDefinition}`).join(', ');
            const createTableQuery = `CREATE TABLE ${tableName} (${columns})`;
            connection.query(createTableQuery, (err, results) => {
                if (err) throw err;
                console.log(`Table '${tableName}' created successfully`);
                connection.end(); // Close the connection
            });
        }
    });
}

function executeQueries(queries) {
    if (queries.length === 0) {
        console.log('No queries to execute');
        connection.end(); // Close the connection
        return;
    }
    const query = queries.shift();
    connection.query(query, (err, results) => {
        if (err) throw err;
        console.log(`Query executed successfully: ${query}`);
        executeQueries(queries);
    });
}

module.exports = createTable;


/**
 * HOW TO CREATE COLUMN IN A TABLE
 * */ 

// const newColumn = {
//     new_column_name: 'VARCHAR(255)  NULL',
//     // Define your new column here
// };

// // Call the function to create a table
// createTable('users', {
//     id: 'INT AUTO_INCREMENT PRIMARY KEY',
//     name: 'VARCHAR(255)  NULL',
//     age: 'INT(10) NULL DEFAULT 12',
//     email: 'VARCHAR(255)  NULL',
//     // New column
//     ...newColumn
// });