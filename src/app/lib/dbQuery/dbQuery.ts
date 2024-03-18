import { con } from "../../../server";

// Any types of query string it can execute...
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

export default executeQuery;