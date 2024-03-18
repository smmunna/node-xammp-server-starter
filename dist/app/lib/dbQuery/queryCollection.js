"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = void 0;
const server_1 = require("../../../server");
/**
 * Executes a raw SQL query.
 * @param {string} query - The raw SQL query to execute.
 * @returns {Promise<any>} A Promise that resolves to the result of the query.
 */
const executeQuery = (query) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        server_1.con.query(query, (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
});
/**
 * Selects all records from a table.
 * @param {string} tableName - The name of the table.
 * @returns {Promise<any>} A Promise that resolves to the result of the query.
 */
const selectAll = (tableName) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT * FROM ${tableName}`;
    return executeQuery(query);
});
/**
 * Selects a single record from a table based on a condition.
 * @param {string} tableName - The name of the table.
 * @param {string} columnName - The name of the column.
 * @param {any} condition - The condition for selection.
 * @returns {Promise<any>} A Promise that resolves to the single result based on the query parameters.
 */
const selectOne = (tableName, columnName, condition) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT * FROM ${tableName} WHERE ${columnName} = ${server_1.con.escape(condition)}`;
    return executeQuery(query).then(result => result[0]);
});
/**
 * Selects all records from a table and orders them.
 * @param {string} tableName - The name of the table.
 * @param {string} columnName - The name of the column to order by.
 * @param {string} orderBy - The order direction (DESC or ASC).
 * @returns {Promise<any>} A Promise that resolves to the result of the query.
 */
const selectAllOrderBy = (tableName, columnName, orderBy) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT * FROM ${tableName} ORDER BY ${columnName} ${orderBy}`;
    return executeQuery(query);
});
/**
 * Paginates data from a specified table in the database.
 * @param {string} tableName - The name of the table from which data will be paginated.
 * @param {number} pageNumber - The page number.
 * @param {number} itemsPerPage - The number of items per page.
 * @returns {Promise<{ total: number, offset: number, limit: number, data: any[] }>} An object containing pagination details and the paginated data.
 */
const Paginate = (tableName, pageNumber, itemsPerPage) => __awaiter(void 0, void 0, void 0, function* () {
    const offset = (pageNumber - 1) * itemsPerPage;
    const limit = itemsPerPage;
    const countQuery = `SELECT COUNT(*) AS total FROM ${tableName}`;
    const dataQuery = `SELECT * FROM ${tableName} LIMIT ${limit} OFFSET ${offset}`;
    // Execute the count query to get total items
    const countResult = yield executeQuery(countQuery);
    const total = countResult[0].total;
    // Execute the data query to retrieve paginated data
    const data = yield executeQuery(dataQuery);
    return { total, offset, limit, data };
});
/**
 * Retrieve filtered columns from a table.
 * @param {string} tableName - The name of the table.
 * @param {string[]} columns - An array of column names to select.
 * @param {string} [condition=''] - The condition to filter the rows.
 * @param {boolean} [distinct=false] - Whether to select distinct values (default: false).
 * @param {number} [limit=null] - Maximum number of rows to return (default: null, meaning no limit).
 * @returns {Promise<any[]>} A Promise that resolves to the selected columns' data.
 */
const filterTable = (tableName_1, ...args_1) => __awaiter(void 0, [tableName_1, ...args_1], void 0, function* (tableName, columns = [], condition = '', distinct = false, orderBy = '', orderByColumn = '', limit = null) {
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
    const result = yield executeQuery(query);
    return result;
});
exports.Query = {
    executeQuery,
    selectAll,
    selectOne,
    selectAllOrderBy,
    Paginate,
    filterTable,
};
