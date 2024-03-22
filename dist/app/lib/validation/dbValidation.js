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
const queryCollection_1 = require("../dbQuery/queryCollection");
/**
 * @param data: send the data from req.body
 * @param tableName: name of the table from your database
 * */
const validateUserData = (data, tableName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch table structure from the database for the given table name
        const tableInfo = yield queryCollection_1.Query.executeQuery(`DESCRIBE ${tableName}`);
        const invalidFields = [];
        for (const field of tableInfo) {
            // Check if the field exists in the request data
            if (!(field.Field in data)) {
                // If the field is not present in the request data, check if it's nullable or has a default value
                if (field.Null === 'YES' || field.Default !== null) {
                    continue; // Field is nullable or has a default value, skip validation
                }
                else {
                    invalidFields.push({ field: field.Field, details: field }); // Field is required but missing in the request data
                }
            }
            else {
                // Check if the data type of the field matches with the table structure
                const fieldType = field.Type.split('(')[0].toLowerCase(); // Extracting data type and convert to lowercase
                const requestData = data[field.Field];
                let isValidType = false;
                switch (fieldType) {
                    case 'int':
                        isValidType = Number.isInteger(requestData);
                        break;
                    case 'varchar':
                        isValidType = typeof requestData === 'string' && requestData.length <= parseInt(field.Type.match(/\d+/)[0], 10); // Extracting length from varchar(n)
                        break;
                    case 'double':
                    case 'float':
                        isValidType = typeof requestData === 'number';
                        break;
                    case 'text':
                        isValidType = typeof requestData === 'string';
                        break;
                    // Add more cases as needed for other data types
                    default:
                        isValidType = typeof requestData === fieldType;
                }
                if (!isValidType) {
                    invalidFields.push({ field: field.Field, details: field });
                }
            }
        }
        const isValid = invalidFields.length === 0;
        return [isValid, invalidFields, tableInfo];
    }
    catch (error) {
        console.error('Error fetching table structure:', error);
        throw new Error('Error fetching table structure');
    }
});
exports.default = validateUserData;
// Following this way write the code in the controller
// const data = req.body;
// const tableName = 'user_info';
//   const [isValid, invalidFields] = await validateUserData(data, tableName);
//   if (isValid) {
//       // Data is valid, continue with your logic
//       // Further logic to save user to the database, etc.
//       res.status(200).json({ success: true, message: 'Data is valid' });
//   } else {
//       res.status(400).json({
//           success: false, message: `Invalid data for fields: ${invalidFields.map(field => field.field).join(', ')}`,
//           fieldsWithError: invalidFields
//       });
//   }
