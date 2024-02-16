// import { MongoClient, Db } from 'mongodb';

// const DB_URI = "mongodb://localhost:27017/country-code";

// let dbConnection: Db | undefined;

// export const connectToDb = (cb: (err?: Error) => void): void => {
//     MongoClient.connect(DB_URI)
//         .then((client) => {
//             dbConnection = client.db();
//             return cb();
//         })
//         .catch((err) => {
//             console.log(err);
//             return cb(err);
//         });
// };

// export const getDb = (): Db | undefined => dbConnection;
