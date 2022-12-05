import * as mysql from 'mysql2';

import * as dotenv from 'dotenv';

dotenv.config();
const ip = process.env.IP;
const user = process.env.USER;
const password = process.env.PASSWORD;
const port = process.env.PORT;
const database = process.env.DATABASE;

export const con = mysql.createConnection({
                                            host    : ip,
                                            port    : port,
                                            user    : user,
                                            password: password,
                                            database: database,
                                          });

con.connect(function(err) {
  if (err) throw err;
  console.log('Connected!');
});

