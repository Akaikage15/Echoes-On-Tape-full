import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- API Routes ---

// Auth
app.post('/api/auth/register', (req, res) => {
  res.status(501).json({ message: 'Not Implemented' });
});
app.post('/api/auth/login', (req, res) => {
  res.status(501).json({ message: 'Not Implemented' });
});
app.get('/api/auth/profile', (req, res) => {
  res.status(501).json({ message: 'Not Implemented' });
});

// Releases
app.get('/api/releases', (req, res) => {
  res.status(501).json({ message: 'Not Implemented' });
});
app.get('/api/releases/:id', (req, res) => {
  res.status(501).json({ message: 'Not Implemented' });
});


app.get('/', (req, res) => {
  res.send('Echoes On Tape Backend is running!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
