import express from 'express';
import {con as db} from '../db/mysql.js';

db.query(`CREATE TABLE IF NOT EXISTS scores(
                username VARCHAR(40),
                time REAL,
                layout VARCHAR(25),
                difficulty VARCHAR(25)
              )`);

db.query(`CREATE TABLE IF NOT EXISTS layouts(
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(25),
                layout VARCHAR(1000)
                )`);

export const router = express.Router();

router.post('/score', (req, res) => {
  db.query(`INSERT INTO scores(username, time, layout, difficulty) VALUES(?,?,?,?)`, [req.body.username, req.body.time, req.body.layout, req.body.difficulty], function (err) {
    if (err) return console.log(err.message);
  });

  res.send('Score saved');
});

router.get('/scores', (req, res) => {
  let username = req.query.username;
  let layout = req.query.layout;
  let difficulty = req.query.difficulty;

  let sql = `SELECT * FROM scores`;

  const params = [];
  if (username) params.push(`username LIKE '%${username}%'`);
  if (layout) params.push(`layout = '${layout}'`);
  if (difficulty) params.push(`difficulty = '${difficulty}'`);

  if (params.length !== 0) sql += ` WHERE ${params.join(' AND ')}`;

  db.query(sql, [], function (err, rows) {
    if (err) console.log(err.message);

    res.send(rows);
  });
});
router.post('/layout', (req, res) => {
  db.query(`INSERT INTO layouts(name, layout) VALUES(?,?)`, [req.body.name, req.body.layout], function (err) {
    if (err) return console.log(err.message);
  });

  res.send('Layout saved');
});
