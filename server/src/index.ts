import express from 'express';
import cors from 'cors';
import router from './routes';
import 'dotenv/config'

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
