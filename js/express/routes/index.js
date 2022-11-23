import express from 'express';
import sqlite  from 'sqlite3';

const sqlite3 = sqlite.verbose();


let db = new sqlite3.Database(
  './js/express/db/scores',

  (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
  });

db.run(`CREATE TABLE IF NOT EXISTS scores(
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
  let layout = req.query.layout;
  let difficulty = req.query.difficulty;

  let sql = `SELECT * FROM scores`;

  const params = [];
  if (username) params.push(`username = '${username}'`);
  if (layout) params.push(`layout = '${layout}'`);
  if (difficulty) params.push(`difficulty = '${difficulty}'`);

  if (params.length !== 0) sql += ` WHERE ${params.join(' AND ')}`;

  db.all(sql, [], function(err, rows) {
    if (err) console.log(err.message);

    res.send(rows);
  });
});
