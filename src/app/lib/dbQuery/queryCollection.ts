import { con } from "../../../server";

/**
 * Executes a raw SQL query.
 * @param {string} query - The raw SQL query to execute.
 * @returns {Promise<any>} A Promise that resolves to the result of the query.
 */
const executeQuery = async (query: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        con.query(query, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

/**
 * Selects all records from a table.
 * @param {string} tableName - The name of the table.
 * @returns {Promise<any>} A Promise that resolves to the result of the query.
 */
const selectAll = async (tableName: string): Promise<any> => {
    const query = `SELECT * FROM ${tableName}`;
    return executeQuery(query);
}

/**
 * Selects a single record from a table based on a condition.
 * @param {string} tableName - The name of the table.
 * @param {string} columnName - The name of the column.
 * @param {any} condition - The condition for selection.
 * @returns {Promise<any>} A Promise that resolves to the single result based on the query parameters.
 */
const selectOne = async (tableName: string, columnName: string, condition: any): Promise<any> => {
    const query = `SELECT * FROM ${tableName} WHERE ${columnName} = ${con.escape(condition)}`;
    return executeQuery(query).then(result => result[0]);
}

/**
 * Selects all records from a table and orders them.
 * @param {string} tableName - The name of the table.
 * @param {string} columnName - The name of the column to order by.
 * @param {string} orderBy - The order direction (DESC or ASC).
 * @returns {Promise<any>} A Promise that resolves to the result of the query.
 */
const selectAllOrderBy = async (tableName: string, columnName: string, orderBy: string): Promise<any> => {
    const query = `SELECT * FROM ${tableName} ORDER BY ${columnName} ${orderBy}`;
    return executeQuery(query);
}

/**
 * Paginates data from a specified table in the database.
 * @param {string} tableName - The name of the table from which data will be paginated.
 * @param {number} pageNumber - The page number.
 * @param {number} itemsPerPage - The number of items per page.
 * @param {string[]} [columns] - Optional array of column names to fetch. If not provided, all columns will be fetched.
 * @returns {Promise<{ total: number, offset: number, limit: number, data: any[] }>} An object containing pagination details and the paginated data.
 */
const Paginate = async (tableName: string, pageNumber: number, itemsPerPage: number, columns?: string[]): Promise<{ total: number, offset: number, limit: number, data: any[] }> => {
    const offset = (pageNumber - 1) * itemsPerPage;
    const limit = itemsPerPage;
    const columnSelection = columns && columns.length > 0 ? columns.join(', ') : '*'; // Construct column selection

    const countQuery = `SELECT COUNT(*) AS total FROM ${tableName}`;
    const dataQuery = `SELECT ${columnSelection} FROM ${tableName} LIMIT ${limit} OFFSET ${offset}`;

    // Execute the count query to get total items
    const countResult = await executeQuery(countQuery);
    const total = countResult[0].total;

    // Execute the data query to retrieve paginated data
    const data = await executeQuery(dataQuery);

    return { total, offset, limit, data };
};

/**
 * Retrieve filtered columns from a table.
 * @param {string} tableName - The name of the table.
 * @param {string[]} columns - An array of column names to select.
 * @param {string} [condition=''] - The condition to filter the rows.
 * @param {boolean} [distinct=false] - Whether to select distinct values (default: false).
 * @param {string} [orderBy=''] - Order by take two values (DESC | ASC).
 * @param {string} [orderByColumn=''] - Based on which column, you want to order.
 * @param {number} [limit=null] - Maximum number of rows to return (default: null, meaning no limit).
 * @returns {Promise<any[]>} A Promise that resolves to the selected columns' data.
 */
const filterTable = async (tableName: string, columns: string[] = [], condition: string = '', distinct: boolean = false, orderBy: string = '', orderByColumn: string = '', limit: number | null = null): Promise<any[]> => {
    // Generate the SELECT clause
    let selectClause = distinct ? 'SELECT DISTINCT ' : 'SELECT ';
    selectClause += columns.length > 0 ? columns.join(', ') : '*';

    // Generate the SQL query with condition
    let query = `${selectClause} FROM ${tableName}`;
    if (condition) {
        query += ` WHERE ${condition}`;
    }

    if (orderBy && orderByColumn) {
        query += ` ORDER BY ${orderByColumn} ${orderBy}`;
    }

    // Add LIMIT clause if provided
    if (limit !== null) {
        query += ` LIMIT ${limit}`;
    }

    // Execute the query
    const result = await executeQuery(query);
    return result;
};

/**
 * Important Functions
 * 1. SUM
 * 2. AVG
 * 3. MIN
 * 4. MAX
 * 5. UCASE
 * 6. LCASE
 * 5. COUNT
 * 6. 
 */

/**
 * Calculate the sum of values in a column of a table.
 * @param {string} tableName - The name of the table.
 * @param {string} columnName - The name of the column to calculate the sum.
 * @returns {Promise<any>} A Promise that resolves to the sum of values.
 */
const sum = async (tableName: string, columnName: string): Promise<any> => {
    const query = `SELECT SUM(${columnName}) AS total FROM ${tableName}`;
    const result = await executeQuery(query);
    return result.length > 0 ? result[0] : null; // Check if result is not empty before returning
};

/**
 * @param {string} tableName tableName - Provide the name of the table
 * @param {string} tableName columnName - Provide the name of the column
 * @returns  the result
 */
const avg = async (tableName: string, columnName: string): Promise<any> => {
    const query = `SELECT AVG(${columnName}) AS avg FROM ${tableName}`;
    const result = await executeQuery(query);
    return result.length > 0 ? result[0] : null; // Check if result is not empty before returning
};


/**
 * Find the minimum value in a column of a table.
 * @param {string} tableName - The name of the table.
 * @param {string} columnName - The name of the column to find the minimum value.
 * @param {string} [alias=''] - An alias for the minimum value.
 * @returns {Promise<any>} A Promise that resolves to the minimum value.
 */
const min = async (tableName: string, columnName: string, alias: string = ''): Promise<any> => {
    const query = `SELECT MIN(${columnName})${alias ? ` AS ${alias}` : ''} FROM ${tableName}`;
    const result = await executeQuery(query);
    return result[0];
};


/**
 * Find the maximum value in a column of a table.
 * @param {string} tableName - The name of the table.
 * @param {string} columnName - The name of the column to find the maximum value.
 * @param {string} [alias=''] - An alias for the maximum value.
 * @returns {Promise<any>} A Promise that resolves to the maximum value.
 */
const max = async (tableName: string, columnName: string, alias: string = ''): Promise<any> => {
    const query = `SELECT MAX(${columnName})${alias ? ` AS ${alias}` : ''} FROM ${tableName}`;
    const result = await executeQuery(query);
    return result[0];
};


/**
 * Count the number of rows in a table or the number of distinct values in a column.
 * @param {string} tableName - The name of the table.
 * @param {string} columnName - The name of the column for counting distinct values, or '*' for counting all rows.
 * @param {string} [alias=''] - An alias for the count result.
 * @param {boolean} [distinct=false] - Whether to count distinct values (default: false).
 * @returns {Promise<any>} A Promise that resolves to the count result.
 */
const count = async (tableName: string, columnName: string, alias: string = '', distinct: boolean = false): Promise<any> => {
    let query = `SELECT COUNT(`;
    query += distinct ? `DISTINCT ${columnName})` : `${columnName})`;
    query += alias ? ` AS ${alias}` : '';
    query += ` FROM ${tableName}`;

    const result = await executeQuery(query);
    return result[0];
};

/**
 * Execute a LIKE query to search for matching values in a column.
 * @param {string} tableName - The name of the table.
 * @param {string} columnName - The name of the column to search.
 * @param {string} searchTerm - The term to search for.
 * @param {string} [alias=''] - An alias for the result.
 * @returns {Promise<any>} A Promise that resolves to the matching rows.
 */
const like = async (tableName: string, columnName: string, searchTerm: string, alias: string = ''): Promise<any> => {
    const query = `SELECT *${alias ? ` AS ${alias}` : ''} FROM ${tableName} WHERE ${columnName} LIKE '%${searchTerm}%'`;
    const result = await executeQuery(query);
    return result;
};

/**
 * Execute an IN query to filter rows based on specified values in a column.
 * @param {string} tableName - The name of the table.
 * @param {string} columnName - The name of the column to filter.
 * @param {string[]} values - Array of values to filter for.
 * @returns {Promise<any>} A Promise that resolves to the matching rows.
 */
const iN = async (tableName: string, columnName: string, values: string[]): Promise<any> => {
    // Constructing the IN clause with provided values
    const inClause = values.map(value => `'${value}'`).join(', ');

    // Constructing the SQL query
    const query = `SELECT * FROM ${tableName} WHERE ${columnName} IN (${inClause})`;

    // Execute the query and return the result
    const result = await executeQuery(query);
    return result;
};

/**
 * Execute an IN query to filter rows based on specified values in a column.
 * @param {string} tableName - The name of the table.
 * @param {string} columnName - The name of the column to filter.
 * @param {string[]} values - Array of values to filter for.
 * @returns {Promise<any>} A Promise that resolves to the matching rows.
 */
const notIN = async (tableName: string, columnName: string, values: string[]): Promise<any> => {
    // Constructing the IN clause with provided values
    const inClause = values.map(value => `'${value}'`).join(', ');

    // Constructing the SQL query
    const query = `SELECT * FROM ${tableName} WHERE ${columnName} NOT IN (${inClause})`;

    // Execute the query and return the result
    const result = await executeQuery(query);
    return result;
};


/**
 * Execute a BETWEEN query to filter rows based on a range of values in a column.
 * @param {string} tableName - The name of the table.
 * @param {string} columnName - The name of the column to filter.
 * @param {string} value1 - The lower bound value.
 * @param {string} value2 - The upper bound value.
 * @returns {Promise<any>} A Promise that resolves to the matching rows.
 */
const between = async (tableName: string, columnName: string, value1: string, value2: string): Promise<any> => {
    // Constructing the SQL query
    const query = `SELECT * FROM ${tableName} WHERE ${columnName} BETWEEN '${value1}' AND '${value2}'`;

    // Execute the query and return the result
    const result = await executeQuery(query);
    return result;
};






export const Query = {
    executeQuery,
    selectAll,
    selectOne,
    selectAllOrderBy,
    Paginate,
    filterTable,
    sum,
    count,
    avg,
    min,
    max,
    like,
    iN,
    notIN,
    between,
}
