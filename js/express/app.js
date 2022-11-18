import express                 from 'express';
import {router as indexRouter} from './routes/index.js';
import cors                    from 'cors';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use('/', indexRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
