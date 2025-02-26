// import { Knex } from 'knex';
// import * as dotenv from 'dotenv';
// import logger from './logger.ts';

// dotenv.config();
// const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

// export default {
//   development: {
//     client: 'mysql',
//     useNullAsDefault: true,
//     connection: {
//       host: DB_HOST,
//       port: Number(DB_PORT),
//       user: DB_USER,
//       password: DB_PASSWORD,
//       database: DB_NAME,
//     },
//     // pool: {
//     //   afterCreate: (conn: any, cb: any) => {
//     //     conn.run('PRAGMA foreign_keys = ON', cb);
//     //   },
//     // },
//   },

//   production: {
//     client: 'mysql',
//     connection: {
//       database: 'example',
//     },
//     pool: {
//       min: 2,
//       max: 10,
//     },
//   },
// } as { [key: string]: Knex.Config }
