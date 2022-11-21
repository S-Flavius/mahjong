import express from 'express';
import sqlite  from 'sqlite3';

const sqlite3 = sqlite.verbose();


let db = new sqlite3.Database(
  './js/express/db/scores',

  (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQLite database.');
  });

db.run(`CREATE TABLE if not exists scores(
                username text,
                time real,
                layout text,
                difficulty text
              )`);

export const router = express.Router();

router.post('/score', (req, res) => {

  db.run(`INSERT INTO scores(username, time, layout, difficulty) VALUES(?,?,?,?)`,
    [req.body.username, req.body.time, req.body.layout, req.body.difficulty],
    function(err) {
      if (err) return console.log(err.message);
    });

  res.send('Score saved');
});

router.get('/scores', (req, res) => {
  let username = req.query.username;
  let time = req.query.min_time;
  let layout = req.query.layout;
  let difficulty = req.query.difficulty;

  let sql = `SELECT * FROM scores where 1=1 `;

  if (username) sql += ` AND username = '${username}'`;
  if (time) sql += ` AND time >= '${time}'`;
  if (layout) sql += ` AND layout = '${layout}'`;
  if (difficulty) sql += ` AND difficulty = '${difficulty}'`;

  db.all(sql,
         [], function(err, rows) {
      if (err) return console.log(err.message);
      res.send(rows);
    });
});