"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.con = void 0;
const mysql_1 = __importDefault(require("mysql"));
const app_1 = __importDefault(require("./app"));
// Create MySQL connection
exports.con = mysql_1.default.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
exports.con.connect(function (err) {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});
// Export MySQL connection
// Start the app
app_1.default.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`);
});
