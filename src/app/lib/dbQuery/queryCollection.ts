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
 * @returns {Promise<{ total: number, offset: number, limit: number, data: any[] }>} An object containing pagination details and the paginated data.
 */
const Paginate = async (tableName: string, pageNumber: number, itemsPerPage: number): Promise<{ total: number, offset: number, limit: number, data: any[] }> => {
    const offset = (pageNumber - 1) * itemsPerPage;
    const limit = itemsPerPage;
    const countQuery = `SELECT COUNT(*) AS total FROM ${tableName}`;
    const dataQuery = `SELECT * FROM ${tableName} LIMIT ${limit} OFFSET ${offset}`;

    // Execute the count query to get total items
    const countResult = await executeQuery(countQuery);
    const total = countResult[0].total;

    // Execute the data query to retrieve paginated data
    const data = await executeQuery(dataQuery);

    return { total, offset, limit, data };
}

/**
 * Retrieve filtered columns from a table.
 * @param {string} tableName - The name of the table.
 * @param {string[]} columns - An array of column names to select.
 * @param {string} [condition=''] - The condition to filter the rows.
 * @param {boolean} [distinct=false] - Whether to select distinct values (default: false).
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

    if (orderBy) {
        query += ` ORDER BY id ${orderBy}`;
    }

    // Add LIMIT clause if provided
    if (limit !== null) {
        query += ` LIMIT ${orderByColumn} ${limit}`;
    }

    // Execute the query
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
}
