"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const paypal_rest_sdk_1 = __importDefault(require("paypal-rest-sdk"));
paypal_rest_sdk_1.default.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': `${process.env.PAYPAL_CLIENT_ID}`,
    'client_secret': `${process.env.PAYPAL_CLIENT_SECRET}`
});
const createPayPalPayment = (items, total, description) => {
    return new Promise((resolve, reject) => {
        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://localhost:5000/success",
                "cancel_url": "http://localhost:5000/cancel"
            },
            "transactions": [{
                    "item_list": {
                        "items": [items]
                    },
                    "amount": {
                        "currency": "USD",
                        "total": total
                    },
                    "description": description
                }]
        };
        paypal_rest_sdk_1.default.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                reject(error);
            }
            else {
                if (payment.links) {
                    let approvalUrl;
                    for (let i = 0; i < payment.links.length; i++) {
                        if (payment.links[i].rel === 'approval_url') {
                            approvalUrl = payment.links[i].href;
                            break;
                        }
                    }
                    if (approvalUrl) {
                        resolve(approvalUrl);
                    }
                    else {
                        reject(new Error("Approval URL not found."));
                    }
                }
                else {
                    reject(new Error("No links found in payment response."));
                }
            }
        });
    });
};
exports.default = createPayPalPayment;
