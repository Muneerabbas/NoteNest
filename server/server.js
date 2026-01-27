import express from 'express';

const app = express();
const PORT = 1000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from NotesNest server!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
