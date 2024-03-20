"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sslcommerz_lts_1 = __importDefault(require("sslcommerz-lts"));
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = process.env.IS_LIVE === 'false' ? false : true;
const sslCommerzConfiguration = (data) => {
    const sslcz = new sslcommerz_lts_1.default(store_id, store_passwd, is_live);
    return sslcz.init(data).then((apiResponse) => {
        return apiResponse.GatewayPageURL;
    }).catch((error) => {
        console.error('Error initializing SSLCommerz:', error);
        throw new Error('Internal Server Error');
    });
};
exports.default = sslCommerzConfiguration;
