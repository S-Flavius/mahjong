import express from 'express';

export const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.post('/score', (req, res) => {

  // Save score to DB

  res.send('Score saved');
});

