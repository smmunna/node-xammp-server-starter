import SSLCommerzPayment from 'sslcommerz-lts'

const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = process.env.IS_LIVE === 'false' ? false : true;

const sslCommerzConfiguration = (data: any) => {
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
    return sslcz.init(data).then((apiResponse: any) => {
        return apiResponse.GatewayPageURL;
    }).catch((error: Error) => {
        console.error('Error initializing SSLCommerz:', error);
        throw new Error('Internal Server Error');
    });
}

export default sslCommerzConfiguration;